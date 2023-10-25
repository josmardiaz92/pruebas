import os
from datetime import datetime
from rembg import remove

class BackgroundRemover:
    def __init__(self,input_folder,output_folder,): #el 1er parametro es la carpeta donde entraran las imagenes y el 2do es la carpeta donde se daran los resultados
        self.input_folder=input_folder
        self.output_folder=output_folder
    def prosesar_imagenes(self):
        ahora=datetime.now().strftime('%Y-%m-%d %H-%M-%S') #en la variable ahora, estoy pidiendo la fecha del momento en el que estoy ejecutando el metodo. luego lo convierto en un string con el formato año-mes-dia hora-minutos-segundos

        carpeta_resultados=os.path.join(self.output_folder,ahora) #aca se define el nombre completo que llevara la carpeta

        os.makedirs(carpeta_resultados, exist_ok=True) #se utiliza este metodo de os para crear la carpeta con el path ya indicado. a lo ultimo se le indica que si existe la carpeta, no aroje error sino que prosiga

        for archivos in os.listdir(self.input_folder):
            if archivos.endswith(('.png','.jpg','.jpeg')): #si el archivo termina en algun elemento de esta tupla
                input_path=os.path.join(self.input_folder,archivos)
                output_path=os.path.join(carpeta_resultados,archivos)
                self._remover_fondo(input_path,output_path)
                self._mover_imagenes(input_path,carpeta_resultados)


    def _remover_fondo(self,input_path,output_path): #Metodo privado
        with open(input_path,'rb') as inp, open(output_path, 'wb') as outp: #estamos usando context manager para abrir la imagen con permisos de leer binarios y verla en la variable inp y luego abrimos la ubicacion donde terminara la imagen con permisos de escritura 
            background_output=remove(inp.read()) #removemos el fondo
            outp.write(background_output) #escribimos aca

    def _mover_imagenes(self,input_path,carpeta_resultados): #Metodo privado
        carpeta_originales=os.path.join(carpeta_resultados,'originales')
        os.makedirs(carpeta_originales, exist_ok=True)
        archivo=os.path.basename(input_path) #saco el nombre base del archivo del path
        new_path=os.path.join(carpeta_originales,archivo)
        os.rename(input_path,new_path) #mueve el archivo

if __name__ == '__main__':
    input_folder='input'
    output_folder='output'

    remover=BackgroundRemover(input_folder,output_folder)
    remover.prosesar_imagenes()