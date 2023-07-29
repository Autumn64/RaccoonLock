#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char prompt(){
    char op;
    printf("Do you have pip installed in your system? (y/n): ");
    op = fgetc(stdin);
    while ((getchar()) != '\n');
    return op;
}

void install(){
    system("python3 -m pip install pyinstaller");
    system("python3 -m pip install cryptography");
    system("python3 -m PyInstaller --onefile raccoonstealer.py");
    system("mv ./dist/raccoonstealer ./");
    system("rm -rf ./build");
    system("rm -rf ./dist");
    system("rm -f raccoonstealer.spec");
    printf("\n-------------------------------------");
    printf("\nRaccoonStealer has been built successfully. You may now use RaccoonLock without problems.\nPress enter to continue...\n");
    getchar();
}

int main(){
    printf("RaccoonStealer Builder v1.0\nAurora Giselle Flores Gomez (Autumn64), 2023\n\n");
    char option = prompt();
    if (option == 'y'){
        install();
    }else{
        printf("Please install pip before using this software.\n");
    }
    return 0;
}