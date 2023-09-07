/*
  Please compile using GCC / MinGW (I didn't test it in other compilers), make sure you have OpenSSL libraries installed and use flags -lssl -lcrypto 
  (same code works on Windows and GNU/Linux)
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <openssl/err.h>
#include <openssl/evp.h>
#include <openssl/rand.h>
#include "nstdoi.h"

#define KEY_SIZE 32
#define IV_SIZE 16
#define forever for(;;)

unsigned char key[KEY_SIZE];
unsigned char iv[IV_SIZE];
unsigned char *data;


void splash(char *message){
	printf("RaccoonStealer v4.2.2 (c) Autumn64 2023.\nLicensed under BSD-3-Clause license.\n%s\n", message);
	return;
}

void error(char *message, unsigned char *extra){
	splash("");
	fprintf(stderr, "\033[31mError: %s%s!\033[0m\n", message, extra);
	exit(1);
}

void getKeyIV(unsigned char *route){
	int filecontent;
	FILE *filesrc = fopen(route, "r");
	if (filesrc == NULL){
		error("Couldn't read ", route);
	}

	for (int i = 0; i < KEY_SIZE; i++){
		if ((fscanf(filesrc, "%2X", &filecontent)) == EOF) error("EOF reached unexpectedly", "");
		key[i] = (unsigned char)filecontent;
	}

	for (int i = 0; i < IV_SIZE; i++){
		if ((fscanf(filesrc, "%2X", &filecontent)) == EOF) error("EOF reached unexpectedly", "");
		iv[i] = (unsigned char)filecontent;
	}

	fclose(filesrc);
	return;
}

int getData(unsigned char *route){
	int filecontent;
	int DATA_SIZE;
	FILE *filesrc = fopen(route, "r");
	
	if (filesrc == NULL){
		error("Couldn't read ", route);
	}

	for (int i = 0; i < 48; i++){
		if ((fscanf(filesrc, "%X", &filecontent)) == EOF) error("EOF reached unexpectedly", "");
	}

	if ((fscanf(filesrc, "%X", &DATA_SIZE)) == EOF) error("EOF reached unexpectedly", "");

	data = malloc(DATA_SIZE);
	if (data == NULL) error("Couldn't allocate memory for the data", "");

	for (int i = 0; i < DATA_SIZE; i++){
		if ((fscanf(filesrc, "%X", &filecontent)) == EOF) error("EOF reached unexpectedly", "");
		data[i] = (unsigned char)filecontent;
	}

	fclose(filesrc);
	return DATA_SIZE;
}

void createKeyIV(unsigned char *route){
	unsigned char newkey[KEY_SIZE];
	unsigned char newiv[IV_SIZE];
	FILE *filedest;

	if (RAND_bytes(newkey, KEY_SIZE) != 1){
		error("Couldn't create random encryption key", "");
	}
	if (RAND_bytes(newiv, IV_SIZE) != 1){
		error("Couldn't create random initialization vector", "");
	}

	filedest = fopen(route, "w");
	if (filedest == NULL){
		error("Couldn't create ", route);
	}
	for (int i = 0; i < KEY_SIZE; i++){
		fprintf(filedest, "%02X ", newkey[i]);
	}
	for (int i = 0; i < IV_SIZE; i++){
		fprintf(filedest, "%02X ", newiv[i]);
	}
	fclose(filedest);
	splash("\nKey generated successfully!");
	return;
}

int encrypt(unsigned char *plaintext, int plaintext_len, unsigned char *key, unsigned char *iv, unsigned char *ciphertext){
	EVP_CIPHER_CTX *ctx;
	int len;
	int ciphertext_len;

	ctx = EVP_CIPHER_CTX_new();
	if (!ctx) error("Couldn't create EVP context", "");

	if (EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv) != 1) error("Couldn't initialize the encryption operation", "");

	if (EVP_EncryptUpdate(ctx, ciphertext, &len, plaintext, plaintext_len) != 1) error("Couldn't encrypt data", "");

	ciphertext_len = len;

	if (EVP_EncryptFinal_ex(ctx, ciphertext + len, &len) != 1) error("Couldn't finalize the encryption operation", "");

	ciphertext_len += len;
	EVP_CIPHER_CTX_free(ctx);
	
	return ciphertext_len;
}

void addData(unsigned char *route, unsigned char *textToEncrypt, unsigned char *infoText){
	int infoText_len = strlen(infoText);
	getKeyIV(route);
	int textToEncrypt_len = strlen(textToEncrypt);
	unsigned char cipherText[textToEncrypt_len + EVP_CIPHER_block_size(EVP_aes_256_cbc())];
	int cipherText_len;
	FILE *filedest;
	
	cipherText_len = encrypt(textToEncrypt, textToEncrypt_len, key, iv, cipherText);
	
	filedest = fopen(route, "w");
	if (filedest == NULL){
		error("Couldn't create ", route);
	}
	for (int i = 0; i < KEY_SIZE; i++){
		fprintf(filedest, "%02X ", key[i]);
	}
	for (int i = 0; i < IV_SIZE; i++){
		fprintf(filedest, "%02X ", iv[i]);
	}
	fprintf(filedest, "%X ", cipherText_len);
	for (int i = 0; i < cipherText_len; i++){
		fprintf(filedest, "%02X ", cipherText[i]);
	}
	for (int i = 0; i < infoText_len; i++){
		fprintf(filedest, "%02X ", infoText[i]);
	}
	fprintf(filedest, "100 ");
	fclose(filedest);
	splash("\nData added successfully!");
	return;
}

int decrypt(unsigned char *ciphertext, int ciphertext_len, unsigned char *key, unsigned char *iv, unsigned char *plaintext){
	EVP_CIPHER_CTX *ctx;
	int len;
	int plaintext_len;
	ctx = EVP_CIPHER_CTX_new();
	if (!ctx) error("Couldn't create EVP context", "");

	if (EVP_DecryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv) != 1) error("Couldn't initialize the decryption operation", "");

	if (EVP_DecryptUpdate(ctx, plaintext, &len, ciphertext, ciphertext_len) != 1) error("Couldn't decrypt data", "");

	plaintext_len = len;

	if (EVP_DecryptFinal_ex(ctx, plaintext + len, &len) != 1){
		error("Couldn't finalize the decryption operation", "");
	} 
	plaintext_len += len;
	EVP_CIPHER_CTX_free(ctx);
	
	return plaintext_len;
}

void readDecrypted(unsigned char* route){
	int data_len, decryptedText_len;
	getKeyIV(route);
	data_len = getData(route);
	unsigned char decryptedText[data_len];
	decryptedText_len = decrypt(data, data_len, key, iv, decryptedText);
	decryptedText[decryptedText_len] = '\0';
	for (int i = 0; i < decryptedText_len; i++){
		fputc(decryptedText[i], stdout);
	}
	fflush(stdout);
	free(data);
	return;
}

void readInfo(unsigned char* route){
	int DATA_SIZE;
	int filecontent;
	FILE *filesrc;
	
	filesrc = fopen(route, "r");
	if (filesrc == NULL){\
		error("Couldn't read ", route);
	}
	for (int i = 0; i < 48; i++){
		if ((fscanf(filesrc, "%X", &filecontent)) == EOF) error("EOF reached unexpectedly", "");
	}

	if ((fscanf(filesrc, "%X", &DATA_SIZE)) == EOF) error("EOF reached unexpectedly", "");

	for (int i = 0; i < DATA_SIZE; i++){
		if ((fscanf(filesrc, "%X", &filecontent)) == EOF) error("EOF reached unexpectedly", "");
	}
	forever {
		if ((fscanf(filesrc, "%X", &filecontent)) == EOF) error ("EOF reached unexpectedly", "");
		if (filecontent == 0x100) break; //"Close your eyes, count to 1: That's how long forever feels."
		fputc(filecontent, stdout);
	}
	fflush(stdout);
	fclose(filesrc);
	return;
}

int main(int argc, char *argv[]){
	if (argc == 4 && strcmp(argv[1], "-d") == 0 && strcmp(argv[2], "-y") == 0){
		readDecrypted(argv[3]);
		clearscr();
	}else if (argc == 3 && strcmp(argv[1], "-i") == 0){
		readInfo(argv[2]);
		clearscr();
	}else if (argc == 3 && strcmp(argv[1], "-c") == 0){
		splash("\nCreating a new key will overwrite (and delete) all of your previous data,\ndon't run this command unless you know what you're doing.");
	}else if (argc == 4 && strcmp(argv[1], "-c") == 0 && strcmp(argv[2], "-y") == 0){
		createKeyIV(argv[3]);
	}else if (argc == 5 && strcmp(argv[1], "-a") == 0){
		addData(argv[2], argv[3], argv[4]);
	}else{
		splash("\nUnknown parameters.");
	}

	return 0;
}
