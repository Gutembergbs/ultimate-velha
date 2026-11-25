# ♟ Ultimate Jogo da Velha

Versão avançada do Jogo da Velha (Ultimate Tic Tac Toe) feita com **React Native + Expo**.

## ▶️ Como jogar

Dois jogadores se alternam: X e O
No início, o primeiro jogador pode jogar em qualquer tabuleiro pequeno

![Tabuleiro principal](docs/imagens/tabuleiro.PNG)

A posição da jogada define em qual tabuleiro o próximo jogador deve jogar
Exemplo:
- Se você jogar no canto superior direito de um tabuleiro pequeno
- O próximo jogador será enviado para o tabuleiro superior direito do tabuleiro principal


![Exemplo de jogada](docs/imagens/jogada.PNG)

- Se o tabuleiro para onde o jogador foi enviado:
- Já estiver completo ou
- Já tiver um vencedor
👉 o jogador pode escolher qualquer tabuleiro disponível

## 🏆 Como vencer

Vence quem conquistar 3 tabuleiros pequenos em linha no tabuleiro principal

![Exemplo de Vitória](docs/imagens/vitoria.PNG)

Empates em tabuleiros pequenos continuam valendo como bloqueados
Se todos os tabuleiros forem concluídos sem um vencedor no tabuleiro principal, o jogo termina em empate

## 💡 Dica

Planeje não só sua jogada atual, mas onde você vai obrigar o adversário a jogar depois 😉

## ✨ Funcionalidades
- 2 jogadores local
- Modo contra IA
- Timer por jogada
- Undo / Reset
- Destaque de vitórias (tabuleiro pequeno e grande)

## 🚀 Tecnologias
- React Native
- Expo
- TypeScript

## ▶️ Rodando localmente
```bash
npm install
npx expo start
```
## 🌐 Versão Web

Este projeto pode ser executado no navegador usando Expo Web
```bash
npx expo start --web
``` 

## 📁 Portfólio

O site de portfólio estático fica em [`portfolio/`](./portfolio). O workflow
`.github/workflows/deploy-portfolio.yml` publica essa pasta no GitHub Pages após
push para `main`. No GitHub, habilite **Settings → Pages → Source: GitHub Actions**.

## 📱 Preparar publicação na Google Play

O perfil `production` do EAS gera builds Android de produção com incremento
automático da versão. Para preparar um envio:

1. Crie o app no Google Play Console e conclua as informações da ficha, política
   de privacidade, segurança dos dados e testes exigidos pela Play Console.
2. Entre na sua conta Expo e gere o Android App Bundle:

   ```bash
   npx eas-cli@latest login
   npx eas-cli@latest build --platform android --profile production
   ```

3. Envie primeiro para a faixa de teste interno:

   ```bash
   npx eas-cli@latest submit --platform android --profile production
   ```

O envio depende de uma conta de desenvolvedor Google Play, da configuração do
projeto EAS e das credenciais da loja. Revise também o funcionamento do modo
online e as políticas de acesso do Supabase antes de liberar o app.

Desenvolvido com 💙 por Gutemberg
