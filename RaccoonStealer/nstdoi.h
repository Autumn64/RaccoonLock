//Made by Monica Nayely Flores Gomez (Autumn64)
#ifndef NSTDOI_H_INCLUDED
#define NSTDOI_H_INCLUDED

#include<stdio.h>
#include<stdlib.h>
#include<string.h>

#ifdef _WIN32
	#include <windows.h>
	#include <direct.h>
#elif __linux__
	#include <unistd.h>
#endif

char* unnchar(char * str){
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
}

unsigned char *currentPath(){
	unsigned char *buffer;
	buffer = malloc(BUFSIZ);
	if (buffer == NULL) return NULL;
#ifdef _WIN32
	if ((_getcwd(buffer, BUFSIZ)) == NULL) return NULL;
	buffer = realloc(buffer, strlen(buffer));
	return buffer; //Don't forget to free this at the end!
#elif __linux__
	if ((getcwd(buffer, BUFSIZ)) == NULL) return NULL;
	buffer = realloc(buffer, strlen(buffer));
	return buffer;
#endif
}

#endif // NSTDOI_H_INCLUDED
