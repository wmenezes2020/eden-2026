package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image/png"
	"os"
	"os/exec"
	"time"

	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/qr"
)

func main() {
	cli := whatsmeow.NewClient(nil)
	
	// Canal para receber os dados do QR code
	qrChan := make(chan *qr.Code, 1)
	
	// Registra o handler de QR code
	cli.AddEventHandler(func(evt interface{}) {
		switch e := evt.(type) {
		case qr.CodeEvent:
			if e.Code != nil {
				qrChan <- e.Code
			}
		}
	})
	
	// Solicita novo QR code
	err := cli.RequestPairingCode()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Erro ao solicitar QR code: %v\n", err)
		os.Exit(1)
	}
	
	// Aguarda o QR code
	select {
	case code := <-qrChan:
		// Gera imagem PNG do QR code
		img, err := code.Image(256)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Erro ao gerar imagem: %v\n", err)
			os.Exit(1)
		}
		
		// Salva em arquivo
		buf := new(bytes.Buffer)
		err = png.Encode(buf, img)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Erro ao codificar PNG: %v\n", err)
			os.Exit(1)
		}
		
		// Salva a imagem
		err = os.WriteFile("/root/clawd/qr_codes/auth_qr.png", buf.Bytes(), 0644)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Erro ao salvar imagem: %v\n", err)
			os.Exit(1)
		}
		
		// Gera versão ASCII base64 para debug
		b64 := base64.StdEncoding.EncodeToString(buf.Bytes())
		fmt.Printf("QR code salvo em /root/clawd/qr_codes/auth_qr.png\n")
		fmt.Printf("Tamanho: %d bytes\n", len(buf.Bytes()))
		fmt.Printf("Base64 (primeiros 100 chars): %s...\n", b64[:min(100, len(b64))])
		
	case <-time.After(30 * time.Second):
		fmt.Println("Timeout aguardando QR code")
		os.Exit(1)
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
