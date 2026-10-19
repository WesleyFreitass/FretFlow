# 🎸 FretFlow Desktop Studio

**FretFlow** é um assistente desktop inteligente e interativo para guitarristas em fase de aprendizado. Conecte sua guitarra ao PC (via interface de áudio USB, cabo P10/P2 ou microfone), toque e receba avaliação em tempo real com cifras, metrônomo e sincronização de músicas do YouTube estilo *Rocksmith / Yousician*.

---

## ✨ Principais Funcionalidades

1. **Afinador Cromático & Prática Livre:**
   - Detecção monofônica de alta precisão baseada em MPM/Autocorrelação com indicador de agulha em *cents* (-50 a +50).
   - Identificação imediata da corda tocada (E2, A2, D3, G3, B3, E4).
   - Reconhecimento polifônico de acordes em tempo real com exibição da confiança (%).
   - Braço da guitarra interativo mostrando exatamente onde posicionar os dedos (dedos 1, 2, 3 e 4).

2. **Treinador de Acordes com Metrônomo:**
   - Selecione sequências clássicas (ex: Pop Clássico `C -> G -> Am -> F`, Balada `Em -> C -> G -> D`, Blues ou Power Chords).
   - Ajuste o tempo (BPM) e troque de acorde no tempo 1 do compasso.
   - Avaliação instantânea: `PERFEITO!`, `MUITO BOM!`, `ERROU`.
   - Sistema de combo, multiplicador de pontos e precisão percentual.

3. **Modo YouTube & Músicas Sincronizadas:**
   - Player de vídeo integrado com músicas pré-carregadas (*Knockin' On Heaven's Door*, *Zombie*, *Stand By Me*, *Smells Like Teen Spirit*).
   - Permite colar qualquer link ou ID do YouTube.
   - **Esteira de Cifras Sincronizadas:** As cifras deslizam em direção à linha de acerto em tempo real.
   - Pontuação gamificada com animação e efeito de celebração ao final.

4. **Painel de Áudio & Sensibilidade:**
   - Selecione a interface de áudio USB (Focusrite, Behringer, Guitar Link, etc.).
   - VU meter em tempo real.
   - Ganho ajustável (boost) e Noise Gate configurável para eliminar ruídos indesejados.

---

## 🚀 Como Executar o Aplicativo

### Pré-requisitos
- Node.js 18+ instalado.

### 1. Iniciar em Modo Desktop (Electron)
Na pasta do projeto:
```bash
npm start
```
*Ou diretamente via Electron com o build gerado:*
```bash
npm run electron:start
```

### 2. Iniciar em Modo Web (Navegador)
```bash
npm run dev
```
Abra no navegador em `http://localhost:5173`.

---

## 🎧 Dicas para Conexão da Guitarra
- **Som Limpo (Clean Tone):** Use o captador do braço ou da ponte com som limpo (sem distorção pesada ou delay exagerado) para máxima precisão de leitura harmônica.
- **Calibração do Noise Gate:** Abra as configurações de áudio (ícone de engrenagem) e ajuste o Noise Gate para que o ruído ambiente não acione a detecção sozinho.
- **Palhetada Firme:** Palhete com clareza para que as frequências fundamentais fiquem bem definidas no espectro de áudio.
