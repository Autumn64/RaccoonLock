//Please compile using GCC / MinGW, as dirent.h and locale.h do not exist on MSVC (I don't know about other compilers though).
#include <ctype.h>
#include <errno.h>
#include <stdio.h>
#include <dirent.h>
#include <stdlib.h>
#include <string.h>
#include "nstdoi.h"

#define forever for(;;)

unsigned char *srcPath;
unsigned char *RaccoonLockFolder;

void splash(){
	clearscr();
	timeSleep(1000);
	printf("\033[32m****** RaccoonTransfer v2.3 ******\n\n\033[0m");
	return;
}

void error(unsigned char *message, unsigned char *extra){
	splash();
	fprintf(stderr, "\033[31mError: %s%s!\n\033[0m", message, extra); 
	if (srcPath != NULL) free(srcPath);
	if (RaccoonLockFolder != NULL) free(RaccoonLockFolder);
	printf("Press Enter to continue...");
	getchar();
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
		printf("%s was not found!\n", srcPath);
	}else{
		printf("%s was found!\n", srcPath);
		fclose(filesrc);
	}
	timeSleep(2000);
	return;
}

void copyFiles(unsigned char *src, unsigned char *dest, FILE *filesrc, FILE *filedest){
	FILE *verify;
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
			if (src != srcPath) free(src); 
			if (dest != srcPath) free(dest);
			error("EOF reached unexpectedly", "");
		}
		fprintf(filedest, "%02X ", filecontent);
		printf("\r              ");
		printf("\r Read: %02X\n", filecontent);
		float percent = ((ftell(filesrc) / 1024.0) / filesize) * 100.0;
		printf("\033[94m %.1f\033[0m KiB read. \033[32m%.0f%%\033[0m complete.\033[1A", (ftell(filesrc))/1024.0, percent);
		fflush(stdout);
		timeSleep(1);
		if (filecontent == 0x100) break;
	}
	timeSleep(1000);
	printf("\n");
	fclose(filesrc); fclose(filedest);
	verify = fopen(dest, "r");
	if (verify == NULL){
		if (src != srcPath) free(src); 
		if (dest != srcPath) free(dest);
		error("Couldn't create file", "");
	}
	fclose(verify);
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
	if (filesrc == NULL){
		free(cwd);
		error(srcPath, " doesn't exist");
	}

	destFolder = malloc(BUFSIZ);
	destFile = malloc(BUFSIZ);

	if (destFolder == NULL || destFile == NULL){
		free(cwd);
		error("Couldn't allocate memory for the program", "");
	}

	printf(" Enter the full route where you want to make a backup,\n");
	printf(" press Enter for %s: ", cwd);
	fgets(destFolder, BUFSIZ, stdin);
	printf(" Enter the name of the new RLC file (without extension): ");
	fgets(destFile, BUFSIZ, stdin);
	if (strlen(destFolder) == 1 && destFolder[0] == '\n'){
		strncpy(destFolder, cwd, BUFSIZ);
	}
	free(cwd);
	if (strlen(destFile) == 1 && destFile[0] == '\n'){
		printf(" \033[31mFilename must not be empty.\033[0m\n Press Enter to continue...");
		getc(stdin);
		free(destFolder); free(destFile);
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
	printf(" Are you sure you want to make a backup in %s?\n This action will overwrite any file with the same name permanently. (\033[32my\033[0m/\033[31mn\033[0m): ", dest);
	option = getc(stdin);
	cleanstd();
	if ((tolower(option)) != 121){
		printf(" Operation cancelled.\n Press Enter to continue...");
		getc(stdin);
		free(dest); free(destFolder);
		return;
	}

	DIR* dir = opendir(destFolder);
	if (dir){
		printf("\n %s \033[32mexists\033[0m, continuing...\n\n", destFolder);
		closedir(dir);
	}
	else if (ENOENT == errno){
		printf("\n %s \033[31mdoes not exist\033[0m, creating...\n\n", destFolder);
		if ((makeDir(destFolder)) != 0) error("Couldn't create", destFolder);
	}
	else {
		unsigned char destinationFolder[strlen(destFolder)];
		strcpy(destinationFolder, destFolder);
		free(destFolder); free(dest);
		error(destinationFolder, " is not a folder");
	}
	free(destFolder);
	filedest = fopen(dest, "w");
	if (filedest == NULL){
		unsigned char destination[strlen(dest)];
		strcpy(destination, dest);
		free(dest);
		error("Couldn't create ", destination);
	}
	copyFiles(srcPath, dest, filesrc, filedest);

	free(dest);
	printf("\n \033[32mBackup made successfully!\033[0m\n Press Enter to continue...");
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

	if (srcFolder == NULL || srcFile == NULL) {
		free(cwd);
		error("Couldn't allocate memory for the program", "");
	}

	printf(" Enter the full route where you want to restore a backup from,\n");
	printf(" press Enter for %s: ", cwd);
	fgets(srcFolder, BUFSIZ, stdin);
	printf(" Enter the name of the RLC backup file (without extension): ");
	fgets(srcFile, BUFSIZ, stdin);
	if (strlen(srcFolder) == 1 && srcFolder[0] == '\n'){
		strncpy(srcFolder, cwd, BUFSIZ);
	}
	free(cwd);
	if (strlen(srcFile) == 1 && srcFile[0] == '\n'){
		printf(" \033[31mFilename must not be empty.\033[0m\n Press Enter to continue...");
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
	printf(" Are you sure you want to restore a backup from %s?\n This action will overwrite any previous data permanently. (\033[32my\033[0m/\033[31mn\033[0m): ", src);
	option = getc(stdin);
	cleanstd();
	if ((tolower(option)) != 121){
		printf(" Operation cancelled.\n Press Enter to continue...");
		getc(stdin);
		free(src);
		return;
	}

	filesrc = fopen(src, "r");
	if (filesrc == NULL){
		unsigned char source[strlen(src)];
		strcpy(source, src);
		free(src);
		error(source, " doesn't exist");
	}

	DIR* dir = opendir(RaccoonLockFolder);
	if (dir){
		printf("\n %s \033[32mexists\033[0m, continuing...\n\n", RaccoonLockFolder);
		closedir(dir);
	}
	else if (ENOENT == errno){
		printf("\n %s \033[31mdoes not exist\033[0m, creating...\n\n", RaccoonLockFolder);
		if ((makeDir(RaccoonLockFolder)) != 0) error("Couldn't create", RaccoonLockFolder);
	}
	else {
		free(src);
		error(RaccoonLockFolder, " is not a folder");
	}
	filedest = fopen(srcPath, "w");
	if (filedest == NULL){
		free(src);
		error("Couldn't create ", srcPath);
	}
	copyFiles(src, srcPath, filesrc, filedest);

	free(src);
	printf("\n \033[32mBackup restored successfully!\033[0m\n Press Enter to continue...");
	getc(stdin);
	return;
}

void menu(){
	forever{
		char option;
		splash();
		printf(" 1. Make backup\n 2. Restore backup\n 3. Exit\n\n\n\n\n\033[93m(c) Autumn64, 2023.\n\033[36mLicensed by BSD-3-Clause License.\n");
		printf("\033[6A");
		printf("\n \033[0mChoose an option (1-3): ");
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
	printf("\033[0m\n");
	return 0;
}
