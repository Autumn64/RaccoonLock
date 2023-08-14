//Please compile using GCC, as dirent.h does not exist on MSVC (I don't know about Borland compilers though).
#include <stdio.h>
#include <errno.h>
#include <ctype.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include "nstdoi.h"

#define forever for(;;)

unsigned char *srcPath;
unsigned char *RaccoonLockFolder;

void splash(){
	clearscr();
	timeSleep(1000);
	printf("****** RaccoonTransfer v2.0 ******\n\n");
	return;
}

void error(unsigned char *message, unsigned char *extra){
	splash();
	fprintf(stderr, "Error: %s%s!\n", message, extra); 
	if (srcPath != NULL) free(srcPath);
	if (RaccoonLockFolder != NULL) free(RaccoonLockFolder);
	exit(1);
}


void salir(){
	printf(" Exiting");
	fflush(stdout);
	for(int i = 0; i < 5; i++){
		timeSleep(600);
		printf(".");
		fflush(stdout);
	}
	timeSleep(2000);
	clearscr();
	return;
}

void defineSys(){
	size_t fullRouteSize, routeSize;
#ifdef _WIN32
	fullRouteSize = (strlen(getenv("LOCALAPPDATA"))) + 22;
	routeSize = (strlen(getenv("LOCALAPPDATA"))) + 13;
	srcPath = malloc(fullRouteSize);
	RaccoonLockFolder = malloc(routeSize);
	if (srcPath == NULL || RaccoonLockFolder == NULL) error("Couldn't allocate memory for the program", "");

	snprintf(srcPath, fullRouteSize, "%s\\RaccoonLock\\data.rlc", getenv("LOCALAPPDATA"));
	snprintf(RaccoonLockFolder, routeSize, "%s\\RaccoonLock", getenv("LOCALAPPDATA"));
#elif __linux__
	fullRouteSize = (strlen(getenv("HOME"))) + 23;
	routeSize = (strlen(getenv("HOME"))) + 14;
	srcPath = malloc(routeSize);
	RaccoonLockFolder = malloc(routeSize);
	if (srcPath == NULL || RaccoonLockFolder == NULL) error("Couldn't allocate memory for the program", "");
	
	snprintf(srcPath, fullRouteSize, "%s/.raccoonlock/data.rlc", getenv("HOME"));
	snprintf(RaccoonLockFolder, routeSize, "%s/.raccoonlock", getenv("HOME"));
#endif
	return;
}

void checkIfExists(){
	splash();
	FILE *filesrc;

	filesrc = fopen(srcPath, "r");
	if (filesrc == NULL){
		fprintf(stderr, "%s was not found!\n", srcPath);
	}else{
		printf("%s was found!\n", srcPath);
		fclose(filesrc);
	}
	timeSleep(2000);
	return;
}

void copyFiles(unsigned char *src, unsigned char *dest, FILE *filesrc, FILE *filedest){
	int filecontent;
	float filesize;
	printf(" %s >> %s\n", src, dest);
	timeSleep(3000);
	fseek(filesrc, 0, SEEK_END);
	filesize = (ftell(filesrc)) / 1024.0;

	printf("\n File size is %.1f KiB\n", filesize);
	fseek(filesrc, 0, SEEK_SET);
	printf("\r Read: ");
	fflush(stdout);
	timeSleep(1000);
	forever{
		if ((fscanf(filesrc, "%X", &filecontent)) == EOF){
			timeSleep(2000);
			fclose(filesrc);
			fclose(filedest);
			free(src); free(dest);
			src = NULL; dest = NULL; srcPath = NULL;
			error("EOF reached unexpectedly", "");
		}
		fprintf(filedest, "%02X ", filecontent);
		printf("\r              ");
		printf("\r Read: %02X\n", filecontent);
		float percent = ((ftell(filesrc) / 1024.0) / filesize) * 100.0;
		printf(" %.1f KiB read. %.0f%% complete.\033[1A", (ftell(filesrc))/1024.0, percent);
		fflush(stdout);
		timeSleep(2);
		if (filecontent == 0x100) break;
	}
	timeSleep(1000);
	printf("\n");
	fclose(filesrc); fclose(filedest);
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
	printf(" Enter the name of the new RLC file (without extension): ");
	fgets(destFile, BUFSIZ, stdin);
	if (strlen(destFolder) == 1 && destFolder[0] == '\n'){
		strncpy(destFolder, cwd, BUFSIZ);
	}
	free(cwd);
	cwd = NULL;
	if (strlen(destFile) == 1 && destFile[0] == '\n'){
		printf(" Filename must not be empty.\n Press Enter to continue...");
		getc(stdin);
		free(destFolder); free(destFile);
		destFolder = NULL; destFile = NULL;
		return;
	}
	unnchar(destFolder);
	unnchar(destFile);
	size = (strlen(destFolder)) + (strlen(destFile)) + 7;
	destFolder = realloc(destFolder, strlen(destFolder) + 1);
	destFile = realloc(destFile, strlen(destFile) + 1);
	dest = malloc(size);
	snprintf(dest, size, "%s/%s.rlc", destFolder, destFile);
	free(destFile);
	destFile = NULL;
	printf(" Are you sure you want to make a backup in %s?\n This action will overwrite any file with the same name permanently. (y/n): ", dest);
	option = getc(stdin);
	cleanstd();
	if ((tolower(option)) != 121){
		printf(" Operation cancelled.\n Press Enter to continue...");
		getc(stdin);
		free(dest); free(destFolder);
		dest = NULL; destFolder = NULL;
		return;
	}

	DIR* dir = opendir(destFolder);
	if (dir){
		printf("\n %s exists, continuing...\n\n", destFolder);
		closedir(dir);
	}
	else if (ENOENT == errno){
		printf("\n %s does not exist, creating...\n\n", destFolder);
		if ((makeDir(destFolder)) != 0) error("Couldn't create", destFolder);
	}
	else {
		unsigned char destinationFolder[strlen(destFolder)];
		strcpy(destinationFolder, destFolder);
		free(destFolder); free(dest);
		destFolder = NULL; dest = NULL;
		error(destinationFolder, " is not a folder!");
	}
	free(destFolder);
	destFolder = NULL;
	filedest = fopen(dest, "w");
	if (filedest == NULL){
		unsigned char destination[strlen(dest)];
		strcpy(destination, dest);
		free(dest);
		dest = NULL;
		error("Couldn't create ", destination);
	}
	copyFiles(srcPath, dest, filesrc, filedest);

	free(dest);
	dest = NULL;
	printf("\n Backup made successfully!\n Press Enter to continue...");
	getc(stdin);
	return;
}

void restoreBackup(){
	char option;
	unsigned char *srcFolder, *srcFile, *src;
	size_t size;
	FILE *filesrc, *filedest;
	splash();
	unsigned char* cwd = currentPath();
	if (cwd == NULL) error("Couldn't get current working directory", "");

	srcFolder = malloc(BUFSIZ);
	srcFile = malloc(BUFSIZ);

	if (srcFolder == NULL || srcFile == NULL) error("Couldn't allocate memory for the program", "");

	printf(" Enter the full route where you want to restore a backup from,\n");
	printf(" press Enter for %s: ", cwd);
	fgets(srcFolder, BUFSIZ, stdin);
	printf(" Enter the name of the RLC backup file (without extension): ");
	fgets(srcFile, BUFSIZ, stdin);
	if (strlen(srcFolder) == 1 && srcFolder[0] == '\n'){
		strncpy(srcFolder, cwd, BUFSIZ);
	}
	free(cwd);
	cwd = NULL;
	if (strlen(srcFile) == 1 && srcFile[0] == '\n'){
		printf(" Filename must not be empty.\n Press Enter to continue...");
		getc(stdin);
		free(srcFolder); free(srcFile);
		return;
	}
	unnchar(srcFolder);
	unnchar(srcFile);
	size = (strlen(srcFolder)) + (strlen(srcFile)) + 7;
	srcFolder = realloc(srcFolder, strlen(srcFolder) + 1);
	srcFile = realloc(srcFile, strlen(srcFile) + 1);
	src = malloc(size);
	snprintf(src, size, "%s/%s.rlc", srcFolder, srcFile);
	free(srcFolder); free(srcFile);
	srcFolder = NULL; srcFile = NULL;
	printf(" Are you sure you want to restore a backup from %s?\n This action will overwrite any previous data permanently. (y/n): ", src);
	option = getc(stdin);
	cleanstd();
	if ((tolower(option)) != 121){
		printf(" Operation cancelled.\n Press Enter to continue...");
		getc(stdin);
		free(src);
		src = NULL;
		return;
	}

	filesrc = fopen(src, "r");
	if (filesrc == NULL){
		unsigned char source[strlen(src)];
		strcpy(source, src);
		free(src);
		src = NULL;
		error(source, " doesn't exist");
	}

	DIR* dir = opendir(RaccoonLockFolder);
	if (dir){
		printf("\n %s exists, continuing...\n\n", RaccoonLockFolder);
		closedir(dir);
	}
	else if (ENOENT == errno){
		printf("\n %s does not exist, creating...\n\n", RaccoonLockFolder);
		if ((makeDir(RaccoonLockFolder)) != 0) error("Couldn't create", RaccoonLockFolder);
	}
	else {
		free(src);
		src = NULL;
		error(RaccoonLockFolder, " is not a folder!");
	}
	filedest = fopen(srcPath, "w");
	if (filedest == NULL){
		free(src);
		src = NULL;
		error("Couldn't create ", srcPath);
	}
	copyFiles(src, srcPath, filesrc, filedest);

	free(src);
	src = NULL;
	printf("\n Backup restored successfully!\n Press Enter to continue...");
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
				restoreBackup();
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
	if (srcPath != NULL) free(srcPath);
	if (RaccoonLockFolder != NULL) free(RaccoonLockFolder);
	return 0;
}
