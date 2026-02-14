package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"os/exec"

	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/store"
	waLog "go.mau.fi/whatsmeow/util/log"
)

func main() {
	fmt.Println("=== WhatsApp QR Code Generator ===")
	
	// Cria o diretório de store
	storeDir := "/root/.wacli"
	os.MkdirAll(storeDir, 0700)
	
	// Logger do cliente
	clientLog := waLog.Stdout("Client", "DEBUG", false)
	
	// Cria o cliente
	deviceStore := &store.Device{}
	cli := whatsmeow.NewClient(deviceStore, clientLog)
	
	// Verifica se já está logado
	if cli.Store.ID != nil {
		fmt.Println("\n✅ Já autenticado!")
		fmt.Printf("Telefone: %s\n", cli.Store.ID.String())
		os.Exit(0)
	}
	
	ctx := context.Background()
	
	// Obtém o canal de QR code
	qrChan, err := cli.GetQRChannel(ctx)
	if err != nil {
		fmt.Fprintf(os.Stderr, "\n❌ Erro ao obter canal QR: %v\n", err)
		os.Exit(1)
	}
	
	// Conecta
	err = cli.Connect()
	if err != nil {
		fmt.Fprintf(os.Stderr, "\n❌ Erro ao conectar: %v\n", err)
		os.Exit(1)
	}
	
	fmt.Println("\n🔄 Aguardando QR code...")
	
	// Processa eventos do QR channel
	for evt := range qrChan {
		if evt.Event == "code" {
			qrData := evt.Code
			fmt.Println("\n✅ QR code recebido!")
			
			// Gera imagem PNG usando qrencode
			cmd := exec.Command("qrencode", "-o", "/root/clawd/qr_code.png", "-s", "8", "-l", "H", qrData)
			err = cmd.Run()
			if err != nil {
				fmt.Fprintf(os.Stderr, "\n❌ Erro ao gerar imagem QR: %v\n", err)
				// Salva pelo menos os dados em texto
				os.WriteFile("/root/clawd/qr_code.txt", []byte(qrData), 0644)
				fmt.Println("Dados do QR salvos em: /root/clawd/qr_code.txt")
			} else {
				fmt.Println("📷 QR code salvo em: /root/clawd/qr_code.png")
				
				// Converte para base64 para verificar
				data, _ := os.ReadFile("/root/clawd/qr_code.png")
				b64 := base64.StdEncoding.EncodeToString(data)
				if len(b64) > 100 {
					fmt.Printf("Base64 (primeiros 100 chars): %s...\n", b64[:100])
				}
			}
			
			fmt.Println("\n📱 Por favor, escaneie com seu WhatsApp!")
			fmt.Println("   (Linked Devices > Add Device)")
			fmt.Println("\n⏳ Aguardando autenticação...")
			
		} else if evt.Event == "success" {
			fmt.Println("\n🎉 Autenticação concluída com sucesso!")
			fmt.Printf("Telefone: %s\n", cli.Store.ID.String())
			cli.Disconnect()
			os.Exit(0)
		} else if evt.Event == "timeout" {
			fmt.Println("\n⏰ Timeout - QR code expirou")
			cli.Disconnect()
			os.Exit(1)
		} else if evt.Event == "closed" {
			fmt.Println("\n🔒 Canal QR fechado")
			cli.Disconnect()
			os.Exit(1)
		} else {
			fmt.Printf("📢 Evento: %s\n", evt.Event)
		}
	}
}
