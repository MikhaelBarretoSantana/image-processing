"""
Script de teste para o ajuste automático
"""
import os
from src.processamento_imagem import ProcessadorImagem
from PIL import Image
import numpy as np

# Procura por uma imagem de teste
test_dirs = ['images', 'temp/uploads', '.']
test_image = None

for dir_path in test_dirs:
    if os.path.exists(dir_path):
        for file in os.listdir(dir_path):
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                test_image = os.path.join(dir_path, file)
                break
    if test_image:
        break

if not test_image:
    print("❌ Nenhuma imagem de teste encontrada!")
    print("Por favor, coloque uma imagem em 'backend/images/' para testar")
    exit(1)

print(f"🖼️  Testando com: {test_image}")

try:
    # Carrega a imagem
    proc = ProcessadorImagem(test_image)
    
    # Verifica info da imagem original
    print(f"📊 Tamanho: {proc.imagem.size}")
    print(f"📊 Modo: {proc.imagem.mode}")
    
    # Pega uma amostra de valores da imagem original
    img_array = np.array(proc.imagem)
    print(f"\n📈 Valores originais (amostra):")
    print(f"   Min: {img_array.min()}")
    print(f"   Max: {img_array.max()}")
    print(f"   Mean: {img_array.mean():.2f}")
    
    # Aplica ajuste automático
    print("\n⚙️  Aplicando ajuste automático...")
    proc.ajuste_automatico()
    
    # Verifica valores após ajuste
    img_array_ajustado = np.array(proc.imagem_processada)
    print(f"\n📈 Valores após ajuste:")
    print(f"   Min: {img_array_ajustado.min()}")
    print(f"   Max: {img_array_ajustado.max()}")
    print(f"   Mean: {img_array_ajustado.mean():.2f}")
    
    # Verifica se não está tudo branco
    if img_array_ajustado.max() == 255 and img_array_ajustado.min() == 255:
        print("\n❌ ERRO: Imagem ficou completamente branca!")
    elif img_array_ajustado.max() == 0 and img_array_ajustado.min() == 0:
        print("\n❌ ERRO: Imagem ficou completamente preta!")
    else:
        print("\n✅ Ajuste automático funcionou corretamente!")
        
        # Salva resultado para inspeção visual
        output_path = "temp/outputs/teste_auto_ajuste.jpg"
        os.makedirs("temp/outputs", exist_ok=True)
        proc.salvar(output_path)
        print(f"💾 Imagem salva em: {output_path}")

except Exception as e:
    print(f"\n❌ ERRO: {e}")
    import traceback
    traceback.print_exc()
