//RaccoonTransfer rewrite 1; right now it doesn't really do anything
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "nstdoi.h"

#define forever for(;;)

unsigned char *srcPath;

void error(unsigned char *message, unsigned char *extra){
	fprintf(stderr, "Error: %s%s!", message, extra); 
	exit(1);
}

void splash(){
	clearscr();
	timeSleep(1000);
	printf("****** RaccoonTransfer v2.0 ******\n\n");
	return;
}

void salir(){
	printf(" Exiting");
	for(int i = 0; i < 5; i++){
		printf(".");
		fflush(stdout);
		timeSleep(600);
	}
	timeSleep(2000);
	clearscr();
	return;
}

void defineSys(){
	size_t routeSize;
#ifdef _WIN32
	routeSize = (strlen(getenv("LOCALAPPDATA"))) + 21;
	srcPath = malloc(routeSize);
	if (srcPath == NULL) error("Couldn't allocate memory for the program", "");
	strncpy(srcPath, getenv("LOCALAPPDATA"), routeSize);
	strncat(srcPath, "/RaccoonLock/data.rlc", routeSize);
#elif __linux__
	routeSize = (strlen(getenv("HOME"))) + 22;
	srcPath = malloc(routeSize);
	if (srcPath == NULL) error("Couldn't allocate memory for the program", "");
	strncpy(srcPath, getenv("HOME"), routeSize);
	strncat(srcPath, "/.raccoonlock/data.rlc", routeSize);
#endif
	return;
}

void checkIfExists(){
	splash();
	FILE *filesrc;

	filesrc = fopen(srcPath, "r");
	if (filesrc == NULL){
		fprintf(stderr, "%s was not found!\n", srcPath);
	}
	printf("%s was found!\n", srcPath);
	fclose(filesrc);
	timeSleep(2000);
	return;
}

void makeBackup(){
	char option;
	unsigned char *destFolder, *destFile, *dest;
	size_t size;
	FILE *filesrc, *filedest;
	splash();
	unsigned char* cwd = currentPath();
	if (cwd == NULL) error("Couldn't get current working directory", "");

	filesrc = fopen(srcPath, "r");
	if (filesrc == NULL) error(srcPath, " doesn't exist");

	destFolder = malloc(BUFSIZ);
	destFile = malloc(BUFSIZ);

	if (destFolder == NULL || destFile == NULL) error("Couldn't allocate memory for the program", "");

	printf(" Enter the full route where you want to make a backup,\n");
	printf(" press Enter for %s: ", cwd);
	fgets(destFolder, BUFSIZ, stdin);
	printf(" Enter the name of the new file: ");
	fgets(destFile, BUFSIZ, stdin);
	if (strlen(destFolder) == 1 && destFolder[0] == '\n'){
		strncpy(destFolder, cwd, BUFSIZ);
	}
	if (strlen(destFile) == 1 && destFile[0] == '\n'){
		printf(" Filename must not be empty.\n Press Enter to continue...");
		getc(stdin);
		free(destFolder); free(destFile); free(cwd);
		return;
	}
	unnchar(destFolder);
	unnchar(destFile);
	size = (strlen(destFolder)) + (strlen(destFile)) + 2;
	destFolder = realloc(destFolder, strlen(destFolder) + 1);
	destFile = realloc(destFile, strlen(destFile) + 1);
	dest = malloc(size);
	snprintf(dest, size, "%s/%s", destFolder, destFile);
	printf(" Are you sure you want to make a backup in %s?\n This action will overwrite any file with the same name permanently. (y/n): ", dest);
	option = getc(stdin);
	cleanstd();
	if ((tolower(option)) != 121){
		printf(" Operation cancelled.\n Press Enter to continue...");
		getc(stdin);
		free(destFolder); free(destFile); free(cwd);
		return;
	}

	filedest = fopen(dest, "w");
	if (filedest == NULL){
		free(destFolder); free(destFile); free(cwd);
		error("Couldn't create ", dest);
	}
	//Create folder and copy file
	
	free(destFolder); free(destFile); free(dest); free(cwd);
	fclose(filesrc); fclose(filedest);
	printf(" Backup made successfully!\n Press Enter to continue...");
	getc(stdin);
	return;
}

void menu(){
	forever{
		char option;
		splash();
		printf(" 1. Make backup\n 2. Restore backup\n 3. Exit\n\n\n\n\nAutumn64, 2023.\nLicensed by BSD-3-Clause License.");
		printf("\033[5A");
		printf("\n Choose an option (1-3): ");
		option = getc(stdin);
		cleanstd();
		switch(option){
			case '1':
				makeBackup();
				break;
			case '2':
				//restoreBackup();
				break;
			case '3':
				salir();
				return;
				break;
			default:
				break;
		}
	}
	return;
}

int main(){
	defineSys();
	checkIfExists();
	menu();
	free(srcPath);
	return 0;
}
