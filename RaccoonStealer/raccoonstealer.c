/*RaccoonStealer v4.0.0 prototype 1.
Right now it just encrypts and decrypts the information that is given along with the "-e" argument. It does not read nor produce any information related to info.json files yet. I might take some time to update this file with these currently lacking functionalities due to personal reasons.

To compile and test this file, please make sure you have the OpenSSL libraries installed in your system, use gcc (I didn't test it with other compilers) and use flags -lssl -lcrypto or any other flags you might need to add the  header files to the preprocessor. It has been tested and it works on Fedora 38, Ubuntu 22.04 and Debian 12, I don't know if it works on Windows although it should since I am not using any non-standard library except for OpenSSL.

The file with extension .rlc this program generates is readable using notepad or any text editor, but the idea is to make it more or less unreadable to the human eye (which is why I write every character as a HEX value), so this along with the AES-256 CBC encryption algorithm and the fact this supposes data.json, info.json and key.key files will be merged into a single unified file would mean a big improvement in RaccoonLock's security and stability. I'm also rewriting RaccoonStealer in C because I want it to be portable, and the current Python-written RaccoonStealer isn't really portable as it needs to be recompiled for each system it runs on.
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <openssl/err.h>
#include <openssl/evp.h>
#include <openssl/rand.h>

#define KEY_SIZE 32
#define IV_SIZE 16

unsigned char key[KEY_SIZE];
unsigned char iv[IV_SIZE];
unsigned char *data;

void error(char *message){
	fprintf(stderr, "Error: %s!", message);
	exit(1);
}

void getKeyIV(){
	int filecontent;
	FILE *filesrc = fopen("data.rlc", "r");
	if (filesrc == NULL){
		error("Couldn't read data.rlc");
	}

	for (int i = 0; i < KEY_SIZE; i++){
		if ((fscanf(filesrc, "%2X", &filecontent)) == EOF) break;
		key[i] = (unsigned char)filecontent;
	}
	if ((fscanf(filesrc, "%X", &filecontent)) == EOF) error("EOF reached unexpectedly");

	for (int i = 0; i < IV_SIZE; i++){
		if ((fscanf(filesrc, "%2X", &filecontent)) == EOF) break;
		iv[i] = (unsigned char)filecontent;
	}
	return;
}

int getData(){
	int filecontent;
	int count = 1;
	int currentChar = 0;
	int charNumber = currentChar + 50;
	FILE *filesrc = fopen("data.rlc", "r");
	data = malloc(charNumber);
	if (filesrc == NULL){
		error("Couldn't read data.rlc");
	}

	while (fscanf(filesrc, "%X", &filecontent) != EOF){
		if (filecontent == 0x100){
			count++;
			continue;
		}
		if (count == 3){
			data[currentChar] = (unsigned char)filecontent;
			currentChar++;
			if (currentChar == charNumber){
				charNumber = currentChar + 50;
				data = realloc(data, charNumber);
			}
		}	
	}
	currentChar--;
	data = realloc(data, currentChar);
	fclose(filesrc);
	return currentChar;
}

void createKeyIV(){
	unsigned char newkey[KEY_SIZE];
	unsigned char newiv[IV_SIZE];
	FILE *filedest;

	if (RAND_bytes(newkey, sizeof(newkey)) != 1){
		error("Couldn't create random encryption key");
	}
	if (RAND_bytes(newiv, sizeof(newiv)) != 1){
		error("Couldn't create random initialization vector");
	}

	filedest = fopen("data.rlc", "w");
	if (filedest == NULL){
		error("Couldn't create data.rlc");
	}
	for (int i = 0; i < sizeof(newkey); i++){
		fprintf(filedest, "%02X ", newkey[i]);
	}
	fprintf(filedest, "100 ");
	for (int i = 0; i < sizeof(newiv); i++){
		fprintf(filedest, "%02X ", newiv[i]);
	}
	fprintf(filedest, "100 ");
	fclose(filedest);
	printf("Key generated successfully\n");
	return;
}

int encrypt(unsigned char *plaintext, int plaintext_len, unsigned char *key, unsigned char *iv, unsigned char *ciphertext){
	EVP_CIPHER_CTX *ctx;
	int len;
	int ciphertext_len;

	ctx = EVP_CIPHER_CTX_new();
	if (!ctx) error("Couldn't create EVP context");

	if (EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv) != 1) error("Couldn't initialize the encryption operation");

	if (EVP_EncryptUpdate(ctx, ciphertext, &len, plaintext, plaintext_len) != 1) error("Couldn't encrypt data");

	ciphertext_len = len;

	if (EVP_EncryptFinal_ex(ctx, ciphertext + len, &len) != 1) error("Couldn't finalize the encryption operation");

	ciphertext_len += len;
	EVP_CIPHER_CTX_free(ctx);
	
	return ciphertext_len;
}

void enc(char *text){
	getKeyIV();
	unsigned char *plaintext = (unsigned char*)text;
	int plaintext_len = strlen(text);
	unsigned char ciphertext[plaintext_len + EVP_CIPHER_block_size(EVP_aes_256_cbc())];
	int ciphertext_len;
	FILE *filedest;
	
	ciphertext_len = encrypt(plaintext, plaintext_len, key, iv, ciphertext);
	
	filedest = fopen("data.rlc", "w");
	for (int i = 0; i < sizeof(key); i++){
		fprintf(filedest, "%02X ", key[i]);
	}
	fprintf(filedest, "100 ");
	for (int i = 0; i < sizeof(iv); i++){
		fprintf(filedest, "%02X ", iv[i]);
	}
	fprintf(filedest, "100 ");
	for (int i = 0; i <= ciphertext_len; i++){
		fprintf(filedest, "%02X ", ciphertext[i]);
	}
	fprintf(filedest, "100 ");
	fclose(filedest);
	printf("Encrypted successfully\n");
	return;
}

int decrypt(unsigned char *ciphertext, int ciphertext_len, unsigned char *key, unsigned char *iv, unsigned char *plaintext){
	EVP_CIPHER_CTX *ctx;
	int len;
	int plaintext_len;
	ctx = EVP_CIPHER_CTX_new();
	if (!ctx) error("Couldn't create EVP context");

	if (EVP_DecryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv) != 1) error("Couldn't initialize the decryption operation");

	if (EVP_DecryptUpdate(ctx, plaintext, &len, ciphertext, ciphertext_len) != 1) error("Couldn't decrypt data");

	plaintext_len = len;

	if (EVP_DecryptFinal_ex(ctx, plaintext + len, &len) != 1){
		ERR_print_errors_fp(stderr);
		error("Couldn't finalize the decryption operation");
	} 
	plaintext_len += len;
	EVP_CIPHER_CTX_free(ctx);
	
	return plaintext_len;
}

void dec(){
	int data_len, decryptedtext_len;
	getKeyIV();
	data_len = getData();
	unsigned char decryptedtext[data_len];
	decryptedtext_len = decrypt(data, data_len, key, iv, decryptedtext);
	decryptedtext[decryptedtext_len] = '\0';
	printf("Decrypted text: ");
	for (int i = 0; i < decryptedtext_len; i++){
		if (decryptedtext[i] == '\0') break;
		fputc(decryptedtext[i], stdout);
	}
	printf("\n");
	return;
}

int main(int argc, char *argv[]){
	if (argc > 1 && strcmp(argv[1], "-c") == 0){
		createKeyIV();
	}else if (argc > 1 && strcmp(argv[1], "-d") == 0){
		dec();
	}else if (argc > 2 && strcmp(argv[1], "-e") == 0){
		enc(argv[2]);
	}
	else{
		printf("Unknown parameters.\n");
	}
	return 0;
}
