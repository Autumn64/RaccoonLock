/*Made by Monica Nayely Flores Gomez (Autumn64)
NSTDOI stands for Non-Standard Output-Input*/
#ifndef NSTDOI_H_INCLUDED
#define NSTDOI_H_INCLUDED

#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include <sys/stat.h>

#ifdef _WIN32
	#include <windows.h>
	#include <direct.h>
#elif __linux__
	#include <unistd.h>
#endif

unsigned char* unnchar(unsigned char * str){
	if (strlen(str) > 1 && str[strlen(str) - 1] == '\n' ){	
		str[strlen(str) - 1] = '\0';
	}
	return str;
}

void cleanstd(){
	while(getchar() != '\n' && getchar() != EOF);
	return;
}

void clearscr(){
#ifdef _WIN32
	system("cls");
#elif __linux__
	system("clear");
#endif
	return;
}

void timeSleep(size_t milliseconds){
#ifdef _WIN32
	Sleep(milliseconds);
#elif __linux__
	usleep(milliseconds * 1000);
#endif
	return;
}

unsigned char *currentPath(){
	unsigned char *buffer;
	buffer = malloc(BUFSIZ);
	if (buffer == NULL) return NULL;
#ifdef _WIN32
	if ((_getcwd(buffer, BUFSIZ)) == NULL){
		free(buffer);
		return NULL;
	}
#elif __linux__
	if ((getcwd(buffer, BUFSIZ)) == NULL){
		free(buffer);
		return NULL;
	}
#endif
	buffer = realloc(buffer, strlen(buffer) + 1);
	return buffer; //Don't forget to free this at the end!
}

int makeDir(unsigned char *dirname){
#ifdef _WIN32
	if ((_mkdir(dirname)) != 0) return -1;
#elif __linux__
	if ((mkdir(dirname, 0777)) != 0) return -1;
#endif
	return 0;
}

int removeDir(unsigned char *dirname){
#ifdef _WIN32
	if ((_rmdir(dirname)) != 0) return -1;
#elif __linux__
	if ((rmdir(dirname)) != 0) return -1;
#endif
	return 0;
}

#endif // NSTDOI_H_INCLUDED
