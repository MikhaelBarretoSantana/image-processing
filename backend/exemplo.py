"""
Exemplo de uso do processador de imagens
Demonstra como ajustar brilho e contraste
"""

import sys
import os
from pathlib import Path

sys.path.append(str(Path(__file__).parent / 'src'))

from src.processamento_imagem import ProcessadorImagem
import matplotlib.pyplot as plt
from PIL import Image


def exemplo_basico():
    """Exemplo básico de processamento de imagem"""
    print("=" * 60)
    print("EXEMPLO 1: Ajuste básico de brilho e contraste")
    print("=" * 60)
    
    
    caminho_imagem = "images/primo.jpeg"
    
    
    if not os.path.exists(caminho_imagem):
        print(f"\n⚠️  Imagem não encontrada: {caminho_imagem}")
        print("Por favor, coloque uma imagem chamada 'exemplo.jpg' na pasta 'images/'")
        return
    
    
    processador = ProcessadorImagem(caminho_imagem)
    
    
    info = processador.obter_info()
    print(f"\nInformações da imagem:")
    print(f"  Formato: {info['formato']}")
    print(f"  Modo: {info['modo']}")
    print(f"  Tamanho: {info['largura']}x{info['altura']} pixels")
    
    
    print(f"\n📝 Aumentando brilho (fator 1.5)...")
    processador.ajustar_brilho(1.5)
    processador.salvar("output/imagem_brilhante.jpg")
    
    
    print(f"📝 Resetando e aumentando contraste (fator 2.0)...")
    processador.resetar()
    processador.ajustar_contraste(2.0)
    processador.salvar("output/imagem_contraste.jpg")
    
    
    print(f"📝 Ajustando brilho e contraste simultaneamente...")
    processador.resetar()
    processador.ajustar_brilho_contraste(1.2, 1.5)
    processador.salvar("output/imagem_brilho_contraste.jpg")
    
    print("\n✅ Processamento concluído!")


def exemplo_comparacao():
    """Exemplo com comparação visual usando matplotlib"""
    print("\n" + "=" * 60)
    print("EXEMPLO 2: Comparação visual de diferentes ajustes")
    print("=" * 60)
    
    caminho_imagem = "images/exemplo.jpg"
    
    if not os.path.exists(caminho_imagem):
        print(f"\n⚠️  Imagem não encontrada: {caminho_imagem}")
        return
    
    
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))
    fig.suptitle('Comparação de Ajustes de Brilho e Contraste', fontsize=16)
    
    
    processador = ProcessadorImagem(caminho_imagem)
    axes[0, 0].imshow(processador.imagem)
    axes[0, 0].set_title('Original')
    axes[0, 0].axis('off')
    
    
    processador.resetar()
    processador.ajustar_brilho(0.5)
    axes[0, 1].imshow(processador.imagem_processada)
    axes[0, 1].set_title('Brilho Reduzido (0.5)')
    axes[0, 1].axis('off')
    
    
    processador.resetar()
    processador.ajustar_brilho(1.5)
    axes[0, 2].imshow(processador.imagem_processada)
    axes[0, 2].set_title('Brilho Aumentado (1.5)')
    axes[0, 2].axis('off')
    
    
    processador.resetar()
    processador.ajustar_contraste(0.5)
    axes[1, 0].imshow(processador.imagem_processada)
    axes[1, 0].set_title('Contraste Reduzido (0.5)')
    axes[1, 0].axis('off')
    
    
    processador.resetar()
    processador.ajustar_contraste(2.0)
    axes[1, 1].imshow(processador.imagem_processada)
    axes[1, 1].set_title('Contraste Aumentado (2.0)')
    axes[1, 1].axis('off')
    
    
    processador.resetar()
    processador.ajustar_brilho_contraste(1.3, 1.5)
    axes[1, 2].imshow(processador.imagem_processada)
    axes[1, 2].set_title('Brilho (1.3) + Contraste (1.5)')
    axes[1, 2].axis('off')
    
    plt.tight_layout()
    plt.savefig('output/comparacao.png', dpi=150, bbox_inches='tight')
    print("\n✅ Comparação salva em 'output/comparacao.png'")
    print("📊 Exibindo gráfico...")
    plt.show()


def exemplo_interativo():
    """Exemplo interativo com entrada do usuário"""
    print("\n" + "=" * 60)
    print("EXEMPLO 3: Modo Interativo")
    print("=" * 60)
    
    caminho_imagem = input("\nDigite o caminho da imagem (ou Enter para usar 'images/exemplo.jpg'): ").strip()
    if not caminho_imagem:
        caminho_imagem = "images/exemplo.jpg"
    
    if not os.path.exists(caminho_imagem):
        print(f"\n❌ Imagem não encontrada: {caminho_imagem}")
        return
    
    try:
        processador = ProcessadorImagem(caminho_imagem)
        
        
        info = processador.obter_info()
        print(f"\nImagem carregada: {info['largura']}x{info['altura']} pixels")
        
        
        print("\nAjuste de Brilho:")
        print("  0.0 = preto completo")
        print("  1.0 = brilho original")
        print("  >1.0 = mais brilhante")
        fator_brilho = float(input("Digite o fator de brilho (ex: 1.2): ") or "1.0")
        
        print("\nAjuste de Contraste:")
        print("  0.0 = cinza uniforme")
        print("  1.0 = contraste original")
        print("  >1.0 = mais contraste")
        fator_contraste = float(input("Digite o fator de contraste (ex: 1.5): ") or "1.0")
        
        
        processador.ajustar_brilho_contraste(fator_brilho, fator_contraste)
        
        
        caminho_saida = input("\nDigite o caminho de saída (ou Enter para 'output/processada.jpg'): ").strip()
        if not caminho_saida:
            caminho_saida = "output/processada.jpg"
        
        processador.salvar(caminho_saida)
        
        
        visualizar = input("\nDeseja visualizar a imagem? (s/n): ").strip().lower()
        if visualizar == 's':
            processador.visualizar()
        
        print("\n✅ Processamento concluído com sucesso!")
        
    except ValueError as e:
        print(f"\n❌ Erro: Valor inválido - {e}")
    except Exception as e:
        print(f"\n❌ Erro: {e}")


def menu_principal():
    """Menu principal para escolher exemplos"""
    while True:
        print("\n" + "=" * 60)
        print("PROCESSAMENTO DE IMAGENS - AJUSTE DE BRILHO E CONTRASTE")
        print("=" * 60)
        print("\nEscolha uma opção:")
        print("1. Exemplo Básico")
        print("2. Comparação Visual (requer imagem)")
        print("3. Modo Interativo")
        print("0. Sair")
        print("-" * 60)
        
        opcao = input("Digite sua escolha: ").strip()
        
        if opcao == "1":
            exemplo_basico()
        elif opcao == "2":
            exemplo_comparacao()
        elif opcao == "3":
            exemplo_interativo()
        elif opcao == "0":
            print("\n👋 Até logo!")
            break
        else:
            print("\n❌ Opção inválida! Tente novamente.")


if __name__ == "__main__":
    menu_principal()
