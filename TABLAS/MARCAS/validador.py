from django import forms
from django.core.exceptions import ValidationError
import re
from django.utils.deconstruct import deconstructible
import spacy

@deconstructible
class ValidadorTextoCoherente:
   def __init__(self, 
                max_consonantes_consecutivas=3,
                max_caracteres_repetidos=2,
                min_ratio_vocales=0.2,
                min_ratio_caracteres_unicos=0.3,
                min_longitud=3,
                max_alternancias=2):
       self.max_consonantes_consecutivas = max_consonantes_consecutivas
       self.max_caracteres_repetidos = max_caracteres_repetidos
       self.min_ratio_vocales = min_ratio_vocales
       self.min_ratio_caracteres_unicos = min_ratio_caracteres_unicos
       self.min_longitud = min_longitud
       self.max_alternancias = max_alternancias
       
       try:
           self.nlp_es = spacy.load('es_core_news_sm')
           self.nlp_en = spacy.load('en_core_web_sm')
       except:
           self.nlp_es = None
           self.nlp_en = None
       
       self.palabras_permitidas = {
           'pollo', 'raza', 'vaca', 'cerdo', 'pato', 'pavo', 'res', 'ave', 
           'carne', 'pescado', 'alimento', 'comida', 'snack', 'premio',
           'gucci', 'frontline', 'filpro', 'purina', 'pedigree', 'royal', 'canin',
           'whiskas', 'pro', 'plan', 'hills', 'eukanuba', 'advance', 'upper','Ken-L',
           'collar', 'mochila', 'transportadora', 'juguete', 'arena', 'cama',
           'plato', 'bebedero', 'comedero', 'correa', 'jaula', 'pecera',
           'adulto', 'cachorro', 'kitten', 'senior', 'razas', 'pequeñas',
           'medianas', 'grandes', 'gigantes', 'granulado',
           'arroz', 'verduras', 'pollo', 'carne', 'pescado', 'atun', 'salmon',
           'cordero', 'cerdo', 'res', 'leche','urinary',
           'y', 'con', 'para', 'de', 'en',
       }
       
       self.palabras_minuscula = {'y', 'con', 'para', 'de', 'en'}

   def _es_secuencia_teclado(self, texto):
       patrones = ['qwe', 'asd', 'zxc', 'rty', 'fgh', 'vbn']
       return any(patron in texto.lower() for patron in patrones)
   
   def _es_palabra_valida_nlp(self, texto):
       if not self.nlp_es or not self.nlp_en:
           return False
           
       # Verificar en español
       doc_es = self.nlp_es(texto)
       if any(token.pos_ in ['NOUN', 'PROPN'] for token in doc_es):
           return True
           
       # Verificar en inglés
       doc_en = self.nlp_en(texto)
       return any(token.pos_ in ['NOUN', 'PROPN'] for token in doc_en)

   def _contiene_palabra_valida(self, texto):
       palabras = texto.lower().split()
       
       # Verificar palabras permitidas
       if any(palabra in self.palabras_permitidas for palabra in palabras):
           return True
           
       # Verificar pares de palabras
       for i in range(len(palabras)-1):
           par = f"{palabras[i]} {palabras[i+1]}"
           if par in self.palabras_permitidas:
               return True
               
       # Verificar con NLP si está disponible
       return any(self._es_palabra_valida_nlp(palabra) for palabra in palabras)

   def validar(self, texto):
       if not texto:
           raise ValidationError('El texto no puede estar vacío')

       texto = texto.strip()
       texto_lower = texto.lower()
       
       if len(texto) < self.min_longitud:
           raise ValidationError(f'El texto debe tener al menos {self.min_longitud} caracteres')

       if re.search(r'[^a-záéíóúñ0-9\s\-_]', texto_lower):
           raise ValidationError('El texto contiene caracteres no permitidos')

       if self._contiene_palabra_valida(texto):
           if self._es_secuencia_teclado(texto_lower):
               raise ValidationError('El texto parece ser una secuencia de teclas no válida')
       else:
           if re.search(f'(.)\1{{{self.max_caracteres_repetidos + 1},}}', texto_lower):
               raise ValidationError(f'El texto contiene demasiados caracteres repetidos')

           if re.search(f'[^aeiouáéíóúü ]{{{self.max_consonantes_consecutivas + 1},}}', texto_lower):
               raise ValidationError(f'El texto contiene demasiadas consonantes consecutivas')

           raise ValidationError('El texto debe contener al menos una palabra válida de producto')

       palabras = texto.split()
       texto_capitalizado = []
       
       for i, palabra in enumerate(palabras):
           palabra_lower = palabra.lower()
           if i == 0 or palabra_lower not in self.palabras_minuscula:
               texto_capitalizado.append(palabra_lower.capitalize())
           else:
               texto_capitalizado.append(palabra_lower)
               
       return ' '.join(texto_capitalizado)

   def __call__(self, valor):
       return self.validar(valor)

   def __eq__(self, other):
       return (
           isinstance(other, ValidadorTextoCoherente) and
           self.max_consonantes_consecutivas == other.max_consonantes_consecutivas and
           self.max_caracteres_repetidos == other.max_caracteres_repetidos and
           self.min_ratio_vocales == other.min_ratio_vocales and
           self.min_ratio_caracteres_unicos == other.min_ratio_caracteres_unicos and
           self.min_longitud == other.min_longitud and
           self.max_alternancias == other.max_alternancias
       )