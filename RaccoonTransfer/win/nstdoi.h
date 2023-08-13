//Made by Monica Nayely Flores Gomez (Autumn64)
#ifndef NSTDOI_H_INCLUDED
#define NSTDOI_H_INCLUDED

#include<stdio.h>
#include<stdlib.h>
#include<string.h>

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
	#include <windows.h>
	Sleep(milliseconds);
#elif __linux__
	#include <unistd.h>
	usleep(milliseconds * 1000);
}

#endif // NSTDOI_H_INCLUDED
