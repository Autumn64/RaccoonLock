/*
This is a component of RaccoonLock. It is not a library but an actual piece of software.

RaccoonLock; A free, open-source, simple and powerful password manager.
RaccoonReader; The RaccoonLock's cryptographic module.
Copyright (c) 2023-2024, Mónica Gómez (Autumn64)

RaccoonReader is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

RaccoonReader is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

/*
This program does two things:
- Reads information from STDIN, encrypts it using AES-256 through a password 
also read from STDIN, and writes the new information to a file.
- Reads information from an encrypted file, asks the user for the password
and tries to decrypt the information. If the program could decrypt the information
successfully, that means the user wrote the correct password. Otherwise, the program
cannot decrypt the information. After the information was decrypted, it prints it to STDOUT.
All errors are written to STDERR.
*/

#include <stdio.h>
#include <openssl/err.h>
#include <openssl/evp.h>
#include <openssl/rand.h>
#include "nsstring.h"

#define KEY_SIZE 32 //Key size in AES-256 is 32 bytes (32 * 8 = 256).
#define IV_SIZE 16
#define SALT_SIZE 8 //We will need a salt so we can derive the key from the password specified by the user.
#define ITERATIONS 10000
#define forever for(;;)

void splash(char *message){
	printf("RaccoonReader v5.0.0\n");
	printf("Copyright (c) 2023-2024, Mónica Gómez (Autumn64)\n");
	printf("This program is free software: you can redistribute it and/or modify it\n");
	printf("under the terms of the GNU General Public License as published by\n");
	printf("the Free Software Foundation, either version 3 of the License, or\n");
	printf("(at your option) any later version.\n\n");
	printf("This program is distributed in the hope that it will be useful,\n");
	printf("but WITHOUT ANY WARRANTY; without even the implied warranty of\n");
	printf("MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU\n");
	printf("General Public License for more details.\n\n");
	printf("You should have received a copy of the GNU General Public License along with this program.\n");
	printf("If not, see <https://www.gnu.org/licenses/>.\n\n");
	printf("%s\n", message);
	return;
}

void help(){
	printf("Usage:\n");
	printf("  Encrypt a file: raccoonreader -c <FILENAME>, raccoonreader --symmetric <FILENAME>\n");
	printf("  Decrypt a file: raccoonreader -d <FILENAME>, raccoonreader --decrypt <FILENAME>\n");
	printf("  Display this screen: raccoonreader -h, raccoonreader --help\n");
	return;
}

void error(char *message){
	fprintf(stderr, "FATAL ERROR: %s\n", message);
	exit(1);
}

void encrypt(char *filename){
	String info = str_new();
	String password1 = str_new();
	String password2 = str_new();
	
	printf("Enter the information to encrypt: ");
	if (str_readln(&info, stdin) != STR_SUCCESS) error("Couldn't allocate memory for the information!");

	printf("Enter a new password: ");
	if (str_readln(&password1, stdin) != STR_SUCCESS){
		str_free(&info);
		error("Couldn't allocate memory for the password!");
	}
	if (password1.length < 9){ //9 because it counts the null character.
		str_free(&info); str_free(&password1);
		error("Password must have a length of at least 8 characters!");
	}

	printf("Re-enter the new password: ");
	if (str_readln(&password2, stdin) != STR_SUCCESS){
		str_free(&info); str_free(&password1);
		error("Couldn't allocate memory for the password!");
	}
	if (str_scomp(password1, password2) == STR_FALSE){
		str_free(&info);
		str_free(&password1);
		str_free(&password2);
		error("Passwords do not match!");
	}

	str_free(&password2); //We will no longer use this one.

	// ---------- BEGIN ENCRYPTION OPERATION ----------
	
	EVP_CIPHER_CTX *ctx;
	int len;
	int ciphertext_len;
	unsigned char iv[IV_SIZE];
	unsigned char salt[SALT_SIZE];
	unsigned char key[KEY_SIZE];
	unsigned char cipherText[info.length - 1 + EVP_CIPHER_block_size(EVP_aes_256_cbc())];

	//Generate random IV.
	if(RAND_bytes(iv, IV_SIZE) != 1){
		str_free(&info); str_free(&password1);
		ERR_print_errors_fp(stderr);
		error("Couldn't create initialization vector!");
	}

	//Generate random salt.
	if(RAND_bytes(salt, SALT_SIZE) != 1){
		str_free(&info); str_free(&password1);
		ERR_print_errors_fp(stderr);
		error("Couldn't create salt!");
	}

	//Derive the encryption key from the provided password.
	if(EVP_BytesToKey(EVP_aes_256_cbc(), EVP_sha256(), salt, (unsigned char *) password1.value, password1.length - 1, ITERATIONS, key, NULL) == 0){
		str_free(&info); str_free(&password1);
		ERR_print_errors_fp(stderr);
		error("Couldn't derive the new encryption key from the password!");
	}

	//Initialize encryption context.
	ctx = EVP_CIPHER_CTX_new();
	if (!ctx){
		str_free(&info); str_free(&password1);
		ERR_print_errors_fp(stderr);
		error("Couldn't create encryption context!");
	}

	//Begin encryption operation with the KEY and the IV
	if (EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv) != 1){
		str_free(&info); str_free(&password1);
		EVP_CIPHER_CTX_free(ctx);
		ERR_print_errors_fp(stderr);
		error("Couldn't begin encryption operation!");
	}

	//Encrypt the data.
	if (EVP_EncryptUpdate(ctx, cipherText, &len, info.value, info.length - 1) != 1){
		str_free(&info); str_free(&password1);
		EVP_CIPHER_CTX_free(ctx);
		ERR_print_errors_fp(stderr);
		error("Couldn't encrypt information!");
	}

	ciphertext_len = len;

	//The encrypted information's length must be a multiple of 8, so we need to add extra bytes to ensure it has the right size.
	if (EVP_EncryptFinal_ex(ctx, cipherText + len, &len) != 1){
		str_free(&info); str_free(&password1);
		EVP_CIPHER_CTX_free(ctx);
		ERR_print_errors_fp(stderr);
		error("Couldn't finish the encryption operation!");
	}

	ciphertext_len += len;

	//Free all the allocated memory as we will no longer use it.
	EVP_CIPHER_CTX_free(ctx);
	str_free(&info);
	str_free(&password1);

	// ---------- END ENCRYPTION OPERATION ----------
	
	//Write the IV, salt and information to a file in binary mode overwriting any previous data.
	FILE *fp;
	fp = fopen(filename, "wb");
	if (!fp) error ("Couldn't create the data file!");	
	fwrite(iv, 1, IV_SIZE, fp);
	fwrite(salt, 1, SALT_SIZE, fp);
	fwrite(cipherText, 1, ciphertext_len, fp);
	fclose(fp);
	
	printf("\nData encrypted successfully!\n\n");
	return;
}

void decrypt(char *filename){
	unsigned char iv[IV_SIZE];
	unsigned char salt[SALT_SIZE];
	unsigned char key[KEY_SIZE];
	int ciphertext_len;
	String password;

	//Read the IV, salt and information from the file in binary mode.
	FILE *fp;
	fp = fopen(filename, "rb");
	if (!fp) error("Couldn't read the specified data file!");

	//Get the file size so we can infere the length of the encrypted information.
	if (fseek(fp, 0, SEEK_END) != 0){
		fclose(fp);
		error("Couldn't get the correct file size!");
	}

	ciphertext_len = ftell(fp) - IV_SIZE - SALT_SIZE;

	if (ciphertext_len <= 0){
		fclose(fp);
		error("Couldn't get the correct information size!");
	}

	unsigned char cipherText[ciphertext_len];
	unsigned char decryptText[ciphertext_len]; //It's alright if the array is bigger than the decrypted information as it will be a null-terminated string.

	if (fseek(fp, 0, SEEK_SET) != 0){
		fclose(fp);
		error("Couldn't begin the file reading operation!");
	}

	//Get the IV.
	if (fread(iv, 1, IV_SIZE, fp) != IV_SIZE){
		fclose(fp);
		error("Couldn't read the initialization vector!");
	}

	//Get the salt.
	if (fread(salt, 1, SALT_SIZE, fp) != SALT_SIZE){
		fclose(fp);
		error("Couldn't read the salt!");
	}

	//Get the encrypted information.
	if (fread(cipherText, 1, ciphertext_len, fp) != ciphertext_len){
		fclose(fp);
		error("Couldn't read the encrypted information!");
	}

	fclose(fp); //We will no longer use the file at this point.
	
	password = str_new();
	printf("Enter your password: ");
	if (str_readln(&password, stdin) != STR_SUCCESS) error("Couldn't allocate memory for the password!");

	// ---------- BEGIN DECRYPTION OPERATION ----------
	EVP_CIPHER_CTX *ctx;
	int len, decrypttext_len;

	if(EVP_BytesToKey(EVP_aes_256_cbc(), EVP_sha256(), salt, (unsigned char *) password.value, password.length - 1, ITERATIONS, key, NULL) == 0){
		str_free(&password);
		ERR_print_errors_fp(stderr);
		error("Couldn't derive the encryption key from the password!");
	}

	str_free(&password); //With the encryption key available we no longer need the password.

	//Initialize decryption context.
	ctx = EVP_CIPHER_CTX_new();
	if (!ctx){
		ERR_print_errors_fp(stderr);
		error("Couldn't create decryption context!");
	}

	//Begin decryption operation with the KEY and the IV
	if (EVP_DecryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv) != 1){
		EVP_CIPHER_CTX_free(ctx);
		ERR_print_errors_fp(stderr);
		error("Couldn't initialize the decryption operation!");
	}

	//Decrypt the data.
	if (EVP_DecryptUpdate(ctx, decryptText, &len, cipherText, ciphertext_len) != 1){
		EVP_CIPHER_CTX_free(ctx);
		ERR_print_errors_fp(stderr);
		error("Couldn't decrypt information!");
	}

	decrypttext_len = len;

	//Finish the decryption operation.
	if (EVP_DecryptFinal_ex(ctx, decryptText + len, &len) != 1){
		EVP_CIPHER_CTX_free(ctx);
		ERR_print_errors_fp(stderr);
		error("Couldn't finish the decryption operation! Did you enter the correct password?");
	}

	decrypttext_len += len;
	
	//Free all the allocated memory as we will no longer use it.
	EVP_CIPHER_CTX_free(ctx);

	// ---------- END DECRYPTION OPERATION ----------
	
	//Null-terminate the decrypted information and write it to STDOUT.
	decryptText[decrypttext_len] = '\0';
	fwrite(decryptText, sizeof(decryptText[0]), decrypttext_len, stdout);
	printf("\n");
	return;
}

int main(int argc, char *argv[]){
	if (argc >= 2 && (strcmp(argv[1], "-h") == 0
	   || strcmp(argv[1], "--help") == 0)){
		help();
		return 0;
	}

	if (argc == 3 && (strcmp(argv[1], "-c") == 0
	   || strcmp(argv[1], "--symmetric") == 0)){
		splash("\nPreparing to encrypt 1 file.\nWARNING: This operation will overwrite any data if the specified file already exists!\n\n");
		encrypt(argv[2]);
		return 0;
	}

	if (argc == 3 && (strcmp(argv[1], "-d") == 0
	   || strcmp(argv[1], "--decrypt") == 0)){
		splash("\nPreparing to decrypt 1 file.\n\n");
		decrypt(argv[2]);
		return 0;
	}

	//Send an error message if user specifies the right parameter but doesn't specify the file.
	if (argc == 2 && (strcmp(argv[1], "-c") == 0
	   || strcmp(argv[1], "--symmetric") == 0)){
		splash("");
		error("A file must be specified!");
		return 1;
	}

	if (argc == 2 && (strcmp(argv[1], "-d") == 0
	   || strcmp(argv[1], "--decrypt") == 0)){
		splash("");
		error("A file must be specified!");
		return 1;
	}

	splash("Unknown parameters.");
	return 0;
}
