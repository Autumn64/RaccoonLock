import sys
import time
import tkinter as tk
import tkinter.ttk as ttk
import tkinter.font as font
from PIL import ImageTk, Image 

class updaterWindow:
    def __init__(self, update):
        self.update = update
        self.root = tk.Tk()
        self.updating_label = tk.Label(text="Updating RaccoonLock, \nmight ask for admin privileges...", bg="#282C34", fg="#D8D8D8", font=("bold", 13))
        self.progressBar = ttk.Progressbar(self.root, orient="horizontal", length=200, mode='determinate')


    def createWindow(self) -> None:
        app_w: int = 300
        app_h: int = 400
        screen_w: int = self.root.winfo_screenwidth()
        screen_h: int = self.root.winfo_screenheight()

        x: int = int((screen_w/2) - (app_w/2))
        y: int = int((screen_h/2) - (app_h/2))

        self.root.geometry(f"{app_w}x{app_h}+{x}+{y}")
        self.root.resizable(width=False, height=False)
        self.root.overrideredirect(True)
        self.root.after(500, self.update)
        self.root.attributes('-topmost', 'true')
        self.placeItems()
        self.root.mainloop()

    def placeItems(self) -> None:
        self.root.configure(bg="#282C34")
        img = Image.open("logo.png")
        img = img.resize((198, 161))
        logo = ImageTk.PhotoImage(img)
        logo_label = tk.Label(image=logo, bg="#282C34")
        logo_label.image = logo
        logo_label.place(relx=.5, rely=.4, anchor="center")
        
        self.updating_label.place(relx=.5, rely=.7, anchor="center")
        self.progressBar.place(relx=.5, rely=.8, anchor="center")
    
    def updateBar(self, size: int) -> None:
        if size <= 100:
            self.progressBar['value'] = size
            self.root.update()

    def destroyWindow(self) -> None:
        self.root.destroy()

    def error(self) -> None:
        self.updating_label['text'] = "Download error! \nPlease check your internet \nconnection."
        self.progressBar.destroy()
        self.root.update()
        time.sleep(8)
        self.destroyWindow()
