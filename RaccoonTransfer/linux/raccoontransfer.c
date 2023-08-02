#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <sys/stat.h>
#include <unistd.h>
#include "nstdoi.h"

char *path;

void salir(){
	printf(" Exiting");
	for(int i = 1; i <= 5; i++){
		printf(".");
		fflush(stdout);
		usleep(500000);
	}
	usleep(2000000);
	return;
}

char *getHome(char *route, size_t size){
	char nroute[size];
	char *fullroute;
	int i;
	for (i = 0; i < strlen(route) - 1; i++){
		nroute[i] = route[i + 1];
	}
	nroute[i] = '\0';
	fullroute = malloc(4096);
	sprintf(fullroute, "%s%s", getenv("HOME"), nroute);
	fullroute = unnchar(fullroute);
	fullroute = realloc(fullroute, strlen(fullroute) + 1);
	return fullroute;
}

int folderExists(){
	struct stat info;
	path = malloc(1024);
	sprintf(path, "%s%s", getenv("HOME"), "/.raccoonlock");
	path = realloc(path, strlen(path) + 1);
	system("clear");
	printf("****** RaccoonTransfer v1.0 ******\n");
	if (stat(path, &info) != 0){
		return 1;
	}else if (info.st_mode & S_ISDIR(info.st_mode)){
		return 0;
	}else{
		return -1;
	}
}

void copyFiles(char* src, char* dest){
	struct stat info;
	char *filenames[] = {"data.json", "info.json", "key.key"};
	char *tmpsrc, *tmpdest;
	int count = 0;
	if(stat(dest, &info) != 0){
		mkdir(dest, 0777);
		printf("\n%s created, copying...\n\n", dest);
	}else if (S_ISDIR(info.st_mode)){
		printf("\n%s exists, copying...\n\n", dest);
	}else{
		printf("\nCouldn't create %s! Please check if it's a valid route and try again.\n", dest);
		printf("Press Enter to continue");
		getc(stdin);
		return;
	}
	for(int i = 0; i < 3; i++){
		char filecontent;
		FILE *filesrc, *filedest;
		tmpsrc = malloc(4096);
		tmpdest = malloc(4096);

		sprintf(tmpsrc, "%s/%s", src, filenames[i]);
		sprintf(tmpdest, "%s/%s", dest, filenames[i]);
		tmpsrc = realloc(tmpsrc, strlen(tmpsrc) + 1);
		tmpdest = realloc(tmpdest, strlen(tmpdest) + 1);
		filesrc = fopen(tmpsrc, "r");
		if(filesrc != NULL){
			filedest = fopen(tmpdest, "w");
			printf("%s >> %s\n", tmpsrc, tmpdest);
			while ((filecontent = fgetc(filesrc)) != EOF){
				fputc(filecontent, filedest);
			}
			fclose(filedest);
			fclose(filesrc);
			usleep(250000);
		}	
		else{
			printf("%s doesn't exist!\n", tmpsrc);
			usleep(250000);
		}
		filedest = fopen(tmpdest, "r");
		if(filedest != NULL){
			fclose(filedest);
			count++;
		}else{
			printf("Something went wrong and %s was copied unsuccessfully\n", tmpdest);
		}
		free(tmpsrc);
		free(tmpdest);
	}
	if(count < 3){
		printf("\nSome files might have been copied incorrectly. Please try again.\nPress Enter to continue...");
		getc(stdin);
		return;
	}
	printf("\nData transferred successfully!\nPress Enter to continue...");
	getc(stdin);
	return;
}

void makeBackup(){
	char *folder;
	char *currentPath;
	char option;
	system("clear");
	usleep(1000000);
	folder = malloc(4096);
	currentPath = malloc(4096);
	getcwd(currentPath, 4096);
	currentPath = realloc(currentPath, strlen(currentPath) + 1);	
	printf("Enter the folder where you want to make a backup,\n");
	printf("press Enter to use %s: ", currentPath);
	fgets(folder, 4096, stdin);
	if (strlen(folder) == 1 && folder[0] == '\n'){
		strcpy(folder, currentPath);
	}
	if (folder[0] == '~'){
		folder = getHome(folder, strlen(folder));
	}
	folder = unnchar(folder);
	folder = realloc(folder, strlen(folder) + 1);
	printf("\nAre you sure you want to create a backup in %s?\nThis action will overwrite any previous backups permanently. (y/n): ", folder);
	option = getc(stdin);
	option = tolower(option);
	cleanstd();
	if (option != 'y'){
		free(folder);
		free(currentPath);
		printf("Operation cancelled.\nPress Enter to continue...");
		getc(stdin);
		return;
	}	
	free(currentPath);
	copyFiles(path, folder);
	free(folder);
	return;
}

void restoreBackup(){
	char *folder;
	char *currentPath;
	char option;

	system("clear");
	usleep(1000000);
	folder = malloc(4096);
	currentPath = malloc(4096);
	getcwd(currentPath, 4096);
	currentPath = realloc(currentPath, strlen(currentPath) + 1);	
	printf("Enter the folder you want to restore a backup from,\n");
	printf("press Enter to use %s: ", currentPath);
	fgets(folder, 4096, stdin);
	if (strlen(folder) == 1 && folder[0] == '\n'){
		strcpy(folder, currentPath);
	}
	if (folder[0] == '~'){
		folder = getHome(folder, strlen(folder));
	}
	folder = unnchar(folder);
	folder = realloc(folder, strlen(folder) + 1);
	printf("\nAre you sure you want to restore a backup from %s?\nThis action will overwrite your current data permanently. (y/n): ", folder);
	option = getc(stdin);
	option = tolower(option);
	cleanstd();
	if (option != 'y'){
		free(folder);
		free(currentPath);
		printf("Operation cancelled.\nPress Enter to continue...");
		getc(stdin);
		return;
	}
	free(currentPath);
	copyFiles(folder, path);
	free(folder);
	return;
}

void menu(){
	while(1){
		char option;
		system("clear");
		usleep(1000000);
		printf("****** RaccoonTransfer v1.0 ******\n");
		printf(" 1. Make backup\n 2. Restore backup\n 3. Exit\n\n\n\n\nAurora Giselle Flores Gomez (Autumn64), 2023.\nLicensed by BSD-3-Clause License.");
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
}

int main(){
	int status = folderExists();
	switch(status){
		case 0:
			menu();
			break;
		case 1:
			printf("RaccoonLock folder does not exist!\n");
			usleep(3000000);
			menu();
			break;
		case -1:
			printf("Could not read RaccoonLock folder!\n");
			return -1;
			break;
	}
	free(path);
	system("clear");
	return 0;
}
