# 🎸 FretFlow — Catálogo Completo de Equipamentos & Guia de Presets para IA

Este documento contém o catálogo completo de todos os **110 Pedais** e **111 Amplificadores** disponíveis no **FretFlow (AmpliTube Edition)**, com seus respectivos IDs, nomes de referência real, parâmetros de knobs e chaves seletoras.

---

## 🤖 1. Prompt Pronto para Copiar e Colar em Outra IA

Copie e envie o texto abaixo para o **ChatGPT, Claude ou DeepSeek** quando quiser solicitar timbres e pedalboards completos:

```text
Você é um engenheiro de som e guitarrista profissional especialista em timbres de estúdio, pedaleiras e amplificadores clássicos.
Eu utilizo o software FretFlow que possui um catálogo exato de 110 pedais e 111 amplificadores modelados do AmpliTube.

Por favor, monte a cadeia de sinal exata para reproduzir o timbre da seguinte música / guitarrista:
Música: [DIGITE O NOME DA MÚSICA AQUI]
Banda/Artista: [DIGITE O NOME DO ARTISTA AQUI]

Responda ESTRITAMENTE com um bloco de código JSON no padrão abaixo:

{
  "name": "Nome da Música / Timbre",
  "artist": "Nome do Artista / Banda",
  "description": "Explicação detalhada de como o timbre foi construído e dicas de palhetada",
  "ampId": "id_do_amplificador",
  "ampKnobs": {
    "gain": 6.5,
    "bass": 6.0,
    "middle": 7.0,
    "treble": 6.5,
    "presence": 6.0,
    "master": 7.5
  },
  "pedals": [
    {
      "id": "id_do_pedal_1",
      "isBypassed": false,
      "knobs": {
        "nome_do_knob": 5.0
      },
      "switches": {}
    }
  ]
}

Regras:
1. Use apenas os IDs de pedais e amplificadores do catálogo fornecido.
2. ampKnobs aceita valores de 0.0 a 10.0 (gain, bass, middle, treble, presence, master).
3. A ordem no array "pedals" define a ordem da cadeia de sinal serial.
```

---

## 📥 2. Padrão JSON de Importação no FretFlow

```json
{
  "name": "Sweet Child O' Mine",
  "artist": "Guns N' Roses",
  "description": "Timbre lendário de Slash: Wah Cry Baby, OverScream boost, JCM800 Lead e Delay no solo.",
  "ampId": "brit_8000",
  "ampKnobs": {
    "gain": 7.0,
    "bass": 6.5,
    "middle": 7.0,
    "treble": 6.0,
    "presence": 6.5,
    "master": 7.5
  },
  "pedals": [
    {
      "id": "wah_gcb95",
      "isBypassed": false,
      "knobs": {
        "pedal": 65
      }
    },
    {
      "id": "overscream",
      "isBypassed": false,
      "knobs": {
        "overdrive": 5.0,
        "tone": 6.5,
        "level": 7.5
      }
    },
    {
      "id": "ddelay",
      "isBypassed": false,
      "knobs": {
        "time": 360,
        "feedback": 25,
        "mix": 30
      }
    },
    {
      "id": "reverb_63",
      "isBypassed": false,
      "knobs": {
        "dwell": 4.5,
        "tone": 5.0,
        "mix": 25
      }
    }
  ]
}
```

---

## 📻 3. Catálogo de Amplificadores (111 Modelos)

Todos os amplificadores suportam os seguintes controles em `ampKnobs`:
* `gain`: 0.0 a 10.0
* `bass`: 0.0 a 10.0
* `middle`: 0.0 a 10.0
* `treble`: 0.0 a 10.0
* `presence`: 0.0 a 10.0
* `master`: 0.0 a 10.0

### 🔹 Clean (28 Amplificadores)
| ID (`ampId`) | Nome no App | Referência Real | Válvulas / Potência | Gabinete |
| :--- | :--- | :--- | :--- | :--- |
| `57_champ` | '57 Champ | Fender '57 Custom Champ Tweed | 12AX7 / 6V6 (5W) | 1x8" Weber Special Design Alnico |
| `57_custom_twin_amp` | '57 Custom Twin-Amp | Fender '57 Custom Twin Tweed | 12AX7 / 6L6 (40W) | 2x12" Eminence Special Design |
| `64_vibroverb_custom` | '64 Vibroverb Custom | Fender '64 Custom Vibroverb | 12AX7 / 6L6 (40W) | 1x15" Jensen C15N |
| `65_deluxe_reverb` | '65 Deluxe Reverb | Fender '65 Deluxe Reverb Blackface | 12AX7 / 6V6 (22W) | 1x12" Jensen C12K |
| `65_princeton` | '65 Princeton | Fender '65 Princeton Reverb | 12AX7 / 6V6 (12W) | 1x10" Jensen C10R |
| `65_super_reverb` | '65 Super Reverb | Fender '65 Super Reverb | 12AX7 / 6L6 (45W) | 4x10" Jensen P10R Alnico |
| `65_twin_reverb` | '65 Twin Reverb | Fender '65 Twin Reverb Blackface | 12AX7 / 6L6 (85W) | 2x12" Jensen C12K |
| `122` | 122 | Leslie 122 Rotary Tube Amp | 12AU7 / 6550 (40W Tube) | Rotary Horn & 15" Woofer Drum |
| `122a` | 122A | Leslie 122A Modern Rotary Amp | 12AX7 / 6550 (40W Tube) | Rotary Horn & 15" Woofer Drum |
| `147` | 147 | Leslie 147 Classic Rotary Amp | 12AU7 / 6550 (40W Tube) | Rotary Horn & 15" Bass Speaker |
| `3300w` | 3300W | Leslie 3300W High Power Rotary | 12AX7 / Solid State (300W) | Rotary Horn & 15" Eminence Woofer |
| `american_clean_mkiii` | American Clean MKIII | Mesa/Boogie Mark III Clean | 12AX7 / 6L6 (85W Simul-Class) | 1x12" Celestion Black Shadow C90 |
| `american_tube_clean_1` | American Tube Clean 1 | Fender Super-Sonic Clean Channel | 12AX7 / 6L6 (60W) | 2x12" Celestion Vintage 30 |
| `american_tube_clean_2` | American Tube Clean 2 | Fender Bassman Clean Channel | 12AX7 / 6L6 (50W) | 4x10" Fender Special Design |
| `american_vintage_b` | American Vintage B | Fender '59 Bassman Tweed | 12AX7 / 6L6 (45W) | 4x10" Jensen P10R Alnico |
| `american_vintage_d` | American Vintage D | Fender Dual Showman Reverb Silverface | 12AX7 / 6L6 (100W) | 2x15" JBL D130F |
| `american_vintage_t` | American Vintage T | Fender Twin Reverb Silverface | 12AX7 / 6L6 (100W) | 2x12" Utah / Oxford Speakers |
| `champion_600` | Champion 600 | Fender Champion 600 Single-Ended | 12AX7 / 6V6 (5W) | 1x6" Special Design Speaker |
| `custom_solid_state_clean` | Custom Solid State Clean | Studio Solid State Clean | Solid State Bipolar (100W) | 2x12" Custom Studio Clean Cab |
| `g37_st12` | G37 / St12 | Gibson GA-37 RVT / Star 12 | 12AX7 / 6V6 (15W Vintage) | 1x12" Jensen P12R |
| `jazz_amp_120` | Jazz Amp 120 | Roland JC-120 Jazz Chorus | Solid State Bipolar (120W Stereo) | 2x12" Roland Silver Cone |
| `jazz_amp_120_cfh` | Jazz Amp 120 CFH | Roland JC-120 Dimebag Darrell Clean | Solid State Bipolar (120W Stereo) | 2x12" Roland Heavy Duty |
| `jh_1200` | JH 1200 | Sunn 1200S Jimi Hendrix Clean | 12AX7 / 6550 (100W) | 2x15" Sunn Transducer |
| `maz_18_jr` | MAZ 18 Jr | Dr. Z MAZ 18 Jr. Boutique Combo | 12AX7 / EL84 (18W Class A) | 1x12" Celestion G12H-30 |
| `metal_clean_t` | Metal Clean T | Mesa/Boogie Triple Rectifier Clean | 12AX7 / 6L6 (150W) | 4x12" Recto Celestion V30 |
| `pro_junior` | Pro Junior | Fender Pro Junior III | 12AX7 / EL84 (15W) | 1x10" Special Design |
| `silvertwelve` | SilverTwelve | Silvertone 1484 Twin Twelve | 12AX7 / 6L6GC (60W) | 2x12" Jensen C12Q |
| `vibro_king` | Vibro-King | Fender Custom Shop Vibro-King | 12AX7 / 6L6 (60W) | 3x10" Jensen P10R Alnico |

### 🔹 Crunch (29 Amplificadores)
| ID (`ampId`) | Nome no App | Referência Real | Válvulas / Potência | Gabinete |
| :--- | :--- | :--- | :--- | :--- |
| `53_bassman` | '53 Bassman | Fender '53 Bassman Tweed 5B6 | 6SC7 / 6L6 (26W) | 1x15" Jensen P15N |
| `57_bandmaster` | '57 Bandmaster | Fender '57 Bandmaster Tweed | 12AX7 / 6L6 (26W) | 3x10" Jensen P10R |
| `57_deluxe` | '57 Deluxe | Fender '57 Deluxe Tweed 5E3 | 12AY7 / 6V6 (12W) | 1x12" Jensen P12Q Alnico |
| `57_custom_champ` | '57 Custom Champ | Fender '57 Custom Champ Tweed Overdrive | 12AX7 / 6V6 (5W) | 1x8" Weber Special Design |
| `57_custom_deluxe` | '57 Custom Deluxe | Fender '57 Custom Deluxe Tweed | 12AY7 / 6V6 (12W) | 1x12" Eminence Special Design |
| `57_custom_pro_amp` | '57 Custom Pro-Amp | Fender '57 Custom Pro-Amp | 12AX7 / 6L6 (26W) | 1x15" Eminence Legend |
| `59_bassman_ltd` | '59 Bassman LTD | Fender '59 Bassman LTD Tweed | 12AX7 / 6L6 (45W) | 4x10" Jensen P10R Alnico |
| `ad_30` | AD 30 | Orange AD30 Class A Dual Channel | 12AX7 / EL84 (30W Class A) | 2x12" Celestion Vintage 30 |
| `american_tube_vintage` | American Tube Vintage | Fender Super-Sonic Vintage Burn | 12AX7 / 6L6 (60W) | 2x12" Celestion Vintage 30 |
| `bi_valve` | Bi-Valve | THD Bi-Valve 30W Single-Ended | 12AX7 / EL34 / 6L6 (30W) | 2x12" THD Custom Cab |
| `bm_30` | BM 30 | Brian May Custom AC30 Treble Booster | ECC83 / EL84 (30W) | 2x12" Celestion Alnico Blue |
| `bm_dk` | BM DK | Brian May Deacy Kit Amp | Germanium Transistor (1W) | 1x6.5" Deacy Speaker |
| `boston_100` | Boston 100 | Tom Scholz Rockman Boston Sustainor | Analogue Solid State (100W) | 4x12" Celestion G12-65 |
| `british_blue_tube_30tb` | British Blue Tube 30TB | Vox AC30 Top Boost Blue Alnico | ECC83 / EL84 (30W Class A) | 2x12" Celestion Alnico Blue |
| `british_copper_30tb` | British Copper 30TB | Vox AC30 Top Boost Copper Panel | ECC83 / EL84 (30W Class A) | 2x12" Celestion Silver Bell |
| `british_lead_s100` | British Lead S100 | Marshall 1959 Super Lead 100W Plexi | ECC83 / EL34 (100W) | 4x12" Celestion Greenback G12M |
| `california_tweed` | California Tweed | Mesa/Boogie California Tweed 6V6 | 12AX7 / 6V6 (40W Multi-Watt) | 1x12" Jensen Blackbird Alnico |
| `custom_solid_state_fuzz` | Custom Solid State Fuzz | AmpliTube Solid State Fuzz Amp | Solid State Fuzz Preamp (100W) | 4x12" Custom Fuzz Speaker |
| `dual_terror` | Dual Terror | Orange Dual Terror 30W Lunchbox | 12AX7 / EL84 (30W/15W/7W) | 2x12" Celestion Vintage 30 |
| `hiamp` | HiAmp | Hiwatt Custom 100 DR103 Gilmour | ECC83 / EL34 (100W Partridge) | 4x12" Fane Crescendo 12A |
| `jh_gold` | JH Gold | Marshall JTM45/100 Hendrix Gold Plexi | ECC83 / KT66 (100W) | 4x12" Celestion Greenback G12H |
| `or_120` | OR-120 | Orange OR120 Vintage Graphic Head | 12AX7 / EL34 (120W) | 4x12" Celestion G12H-30 |
| `or_50` | OR 50 | Orange OR50 40th Anniversary | 12AX7 / EL34 (50W) | 2x12" Celestion Vintage 30 |
| `red_pig` | Red Pig | Marshall Major 200W Pig Blackmore | ECC83 / KT88 (200W High Power) | 4x12" Celestion 100W G12 |
| `super_sonic` | Super-Sonic | Fender Super-Sonic 60W Burn | 12AX7 / 6L6 (60W) | 1x12" Celestion Vintage 30 |
| `tiny_terror` | Tiny Terror | Orange Tiny Terror 15W Lunchbox | 12AX7 / EL84 (15W/7W) | 1x12" Celestion G12K-100 |
| `transatlantic_ta_30` | TransAtlantic TA-30 | Mesa/Boogie TransAtlantic TA-30 | 12AX7 / EL84 (40W/30W/15W) | 2x12" Celestion Custom 90 |
| `tube_vintage_combo` | Tube Vintage Combo | AmpliTube Vintage Tube Combo | 12AX7 / 6L6 (30W) | 1x12" Vintage Tube Speaker |
| `z_wreck` | Z Wreck | Dr. Z Z Wreck Brad Paisley 30W | 12AX7 / EL84 (30W Ken Fischer) | 2x12" Celestion Gold / Blue Alnico |

### 🔹 High Gain (39 Amplificadores)
| ID (`ampId`) | Nome no App | Referência Real | Válvulas / Potência | Gabinete |
| :--- | :--- | :--- | :--- | :--- |
| `brit_100_mod_34_36` | Brit 100 Mod 34/36 | Marshall Slash AFD100 #34/#36 Mod | ECC83 / 6550 (100W) | 4x12" Celestion Vintage 30 |
| `american_lead_mkiii` | American Lead MKIII | Mesa/Boogie Mark III Lead Channel | 12AX7 / 6L6 (85W) | 1x12" Celestion Black Shadow C90 |
| `brit_8000` | Brit 8000 | Marshall JCM800 2203 100W Lead | ECC83 / EL34 (100W) | 4x12" Celestion G12T-75 |
| `brit_9000` | Brit 9000 | Marshall JCM900 4100 Dual Reverb | ECC83 / 5881 (100W) | 4x12" Celestion G12T-75 |
| `brit_silver` | Brit Silver | Marshall 2555X Silver Jubilee 1987 | ECC83 / EL34 (100W/50W) | 4x12" Celestion G12T-75 Silver |
| `brit_valve_pre` | Brit Valve Pre | Marshall JMP-1 MIDI Valve Preamp | ECC83 Preamp / 100W Power | 4x12" Celestion 1960A |
| `british_tube_lead_1` | British Tube Lead 1 | Marshall JCM800 High Gain Lead 1 | ECC83 / EL34 (100W) | 4x12" Celestion Vintage 30 |
| `british_tube_lead_2` | British Tube Lead 2 | Marshall JCM900 High Gain Lead 2 | ECC83 / EL34 (100W) | 4x12" Celestion G12T-75 |
| `custom_modern_hi_gain` | Custom Modern Hi-Gain | AmpliTube Modern Triple High Gain | 12AX7 / 6L6 (120W) | 4x12" Modern Hi-Gain V30 |
| `custom_solid_state_lead` | Custom Solid State Lead | AmpliTube Solid State High Gain | Solid State High Gain (100W) | 4x12" Solid State Lead Cab |
| `darrell_100` | Darrell 100 | Randall RG100ES / Warhead Dimebag | Solid State High Gain (100W) | 4x12" Randall Jaguar Speakers |
| `dual_rectifier` | Dual Rectifier | Mesa/Boogie Dual Rectifier Solo Head | 12AX7 / 6L6 (100W) | 4x12" Recto Celestion V30 |
| `e650` | E650 | ENGL E650 Ritchie Blackmore 100W | ECC83 / 5881 (100W) | 4x12" ENGL Celestion Vintage 30 |
| `german_34` | German 34 | Bogner Ecstasy 101B EL34 100W | 12AX7 / EL34 (100W) | 4x12" Bogner Celestion V30 |
| `jca100h` | JCA100H | Jet City JCA100H by Soldano 100W | 12AX7 / 6L6 (100W) | 4x12" Eminence Custom Jet City |
| `jca20h` | JCA20H | Jet City JCA20H by Soldano 20W | 12AX7 / EL84 (20W) | 1x12" Eminence Custom |
| `brit_la_gold` | Brit L.A. Gold | Marshall JCM800 Kerry King / L.A. Mod | ECC83 / KT88 (100W) | 4x12" Celestion G12K-100 |
| `mark_iic_plus` | Mark IIC+ | Mesa/Boogie Mark IIC+ Metallica Puppets | 12AX7 / 6L6 (75W Graphic EQ) | 4x12" Mesa EVM12L / Black Shadow |
| `mark_iii` | Mark III | Mesa/Boogie Mark III Red Stripe 85W | 12AX7 / 6L6 (85W Graphic EQ) | 1x12" Celestion C90 |
| `mark_iv` | Mark IV | Mesa/Boogie Mark IV 85W 3-Channel | 12AX7 / 6L6 (85W Graphic EQ) | 4x12" Recto Celestion V30 |
| `mark_v` | Mark V | Mesa/Boogie Mark V 90W Multi-Watt | 12AX7 / 6L6 / EL34 (90W) | 4x12" Recto Celestion V30 |
| `metal_lead_t` | Metal Lead T | Mesa/Boogie Triple Rectifier Lead 150W | 12AX7 / 6L6 (150W) | 4x12" Recto Celestion V30 |
| `metal_lead_v` | Metal Lead V | Peavey 5150 / 6505 Lead Eddie Van Halen | 12AX7 / 6L6 (120W) | 4x12" Sheffield 1200 / Celestion |
| `metal_lead_w` | Metal Lead W | Hughes & Kettner Warp T / Warp 7 | 12AX7 / 6L6 (120W) | 4x12" Celestion Hot 100 |
| `mh_500_metalhead` | MH-500 Metalhead | Fender Metalhead MH-500 Solid State | Solid State High Output (500W) | 4x12" Celestion G12T-100 |
| `miniplex_20` | MiniPlex 20 | Fargen Mini Plex MKII 20W Plexi | 12AX7 / EL34 (20W) | 2x12" Celestion Heritage G12M |
| `modern_tube_lead` | Modern Tube Lead | AmpliTube Modern Tube Lead 100W | 12AX7 / 6L6 (100W) | 4x12" Modern Lead Cab |
| `powerball` | Powerball | ENGL Powerball E645 100W 4-Channel | ECC83 / 6L6 (100W) | 4x12" ENGL Celestion V60 |
| `rockerverb_50` | RockerVerb 50 | Orange Rockerverb 50 MKIII Dirty | 12AX7 / EL34 (50W) | 2x12" Celestion Vintage 30 |
| `satch_vm` | Satch VM | Marshall JVM410HJS Joe Satriani 100W | ECC83 / EL34 (100W 4-Channel) | 4x12" Celestion G12 Vintage |
| `silverplate_50` | SilverPlate 50 | AmpliTube SilverPlate 50 High Gain | 12AX7 / 6L6 (50W) | 2x12" SilverPlate Cab |
| `sld_100` | SLD 100 | Soldano SLO-100 Super Lead Overdrive | 12AX7 / 6L6 (100W DeYoung) | 4x12" Soldano Celestion V30 |
| `sj50` | SJ50 | Marshall Silver Jubilee 2550 50W | ECC83 / EL34 (50W/25W) | 2x12" Celestion G12T-75 Silver |
| `thunderverb_200` | Thunderverb 200 | Orange Thunderverb 200 200W Head | 12AX7 / 6550 (200W) | 4x12" Celestion Vintage 30 |
| `triple_rectifier` | Triple Rectifier | Mesa/Boogie Triple Rectifier 150W | 12AX7 / 6L6 (150W) | 4x12" Recto Celestion V30 |
| `triple_crown` | Triple Crown | Mesa/Boogie Triple Crown TC-50/100 | 12AX7 / EL34 / 6L6 (100W) | 4x12" Celestion Vintage 30 |
| `v3m` | V3M | Carvin V3M Micro Head 50W 3-Channel | 12AX7 / EL84 (50W/22W/7W) | 2x12" Carvin GT12 |
| `vhandcraft_4` | VHandcraft 4 | Diezel VH4 100W 4-Channel Tool/Metallica | 12AX7 / KT77 / 6550 (100W) | 4x12" Diezel Celestion V30 |
| `vintage_metal_lead` | Vintage Metal Lead | AmpliTube Vintage Metal Lead 100W | ECC83 / EL34 (100W) | 4x12" Vintage Metal Cab |

### 🔹 Bass (15 Amplificadores)
| ID (`ampId`) | Nome no App | Referência Real | Válvulas / Potência | Gabinete |
| :--- | :--- | :--- | :--- | :--- |
| `360bass_preamp` | 360Bass Preamp | Acoustic 360 Bass Preamp Jaco Pastorius | Solid State Preamp (300W) | 1x18" Folded Horn 361 Enclosure |
| `ad_200` | AD 200 | Orange AD200B MK3 200W Bass Head | 12AX7 / 6550 (200W All-Tube) | 4x10" + 1x15" Orange OBC410/115 |
| `bassman_300` | Bassman 300 | Fender Bassman 300 PRO All-Tube | 12AX7 / 6550 (300W All-Tube) | 8x10" Fender Bassman Pro |
| `green_ba250` | Green BA250 | Trace Elliot AH250 GP11 Graphic EQ | Solid State MOSFET (250W GP11) | 4x10" Trace Elliot Green Cab |
| `mb_150_s` | MB 150 S | Gallien-Krueger MB150S MicroBass Combo | Solid State Micro Tech (150W) | 1x12" GK Paragon Aluminum Cone |
| `new_york_b750` | New York B750 | Markbass Little Mark Tube 800 / TA 501 | Tube/Solid State Blend (750W MPT) | 4x10" Markbass Standard 104HF |
| `solid_state_bass_preamp` | Solid State Bass Preamp | AmpliTube Studio Bass Preamp 500W | Solid State Bass Preamp (500W) | 4x10" Custom Studio Bass Cab |
| `svx_15n` | SVX-15N | Ampeg B-15N Portaflex 1960s Motown | 6SL7 / 6L6GC (30W Flip-Top) | 1x15" Jensen Special Design |
| `svx_15r` | SVX-15R | Ampeg B-15R Portaflex Reissue 100W | 12AX7 / 6L6 (100W/60W) | 1x15" Custom Ampeg Speaker |
| `svx_4b` | SVX-4B | Ampeg V-4B 100W All-Tube Bass Head | 12AX7 / 6L6GC (100W) | 2x12" Ampeg SVT-212AV |
| `svx_500` | SVX-500 | Ampeg BA-500 500W Bass Combo | Solid State High Power (500W) | 2x10" Custom Ampeg + Horn |
| `svx_cl` | SVX-CL | Ampeg SVT-CL Classic 300W All-Tube Monster | 12AX7 / 6550 (300W All-Tube) | 8x10" Geladeira SVT-810E |
| `svx_pro` | SVX-PRO | Ampeg SVT-4PRO Dual Power Preamp | 12AX7 Preamp / 1200W MOSFET | 4x10" + 1x15" SVT Pro Stack |
| `svx_vr` | SVX-VR | Ampeg SVT-VR Vintage Reissue 1969 300W | 12AX7 / 6550 (300W Vintage) | 8x10" SVT-810AV Heritage |
| `tbp_1` | TBP-1 | Fender TBP-1 Tube Bass Preamp Rack Unit | 12AX7 Class A Preamp | 4x10" Fender Pro Series Bass Cab |

---

## 🎛️ 4. Catálogo de Pedais (110 Modelos e seus Knobs)

### 1. Delay (12 Pedais)
* **`ddelay`** (DDelay) → `time` (5-1000ms), `feedback` (0-100%), `mix` (0-100%)
* **`delay`** (Delay Analógico) → `time` (10-1000ms), `feedback` (0-100%), `mix` (0-100%)
* **`digital_delay`** (Digital Delay) → `time` (1-2000ms), `feedback` (0-100%), `mix` (0-100%), `tone` (0-10)
* **`echoman`** (EchoMan) → `delay` (10-600ms), `feedback` (0-100%), `blend` (0-100%), `depth` (0-10)
* **`ep_tape_echo`** (EP Tape Echo) → `sustain` (0-10), `delay_time` (50-800ms), `volume` (0-10)
* **`memory_v`** (Memory-V) → `blend` (0-100%), `feedback` (0-100%), `delay` (10-550ms), `chorus_vib` (0-10)
* **`metal_delay`** (Metal Delay) → `time` (10-1200ms), `feedback` (0-100%), `level` (0-10)
* **`rack_delay`** (Rack Delay) → `time` (1-2000ms), `feedback` (0-100%), `factor` (0.5-2.0), `mix` (0-100%)
* **`space_delay`** (Space Delay) → `repeat_rate` (10-800ms), `intensity` (0-100%), `echo_vol` (0-10)
* **`tape_echo`** (Tape Echo) → `sustain` (0-10), `time` (50-800ms), `level` (0-10)
* **`tape_echo_cfh`** (Tape Echo CFH) → `sustain` (0-10), `time` (50-800ms), `level` (0-10)
* **`tap_delay`** (Tap Delay) → `bpm` (40-240), `feedback` (0-100%), `mix` (0-100%)

### 2. Distortion (18 Pedais)
* **`bigpig`** (BigPig) → `volume` (0-10), `tone` (0-10), `sustain` (0-10)
* **`boston_100`** (Boston 100 Distortion) → `volume` (0-10), `distortion` (0-10), `treble` (0-10)
* **`crusher`** (Crusher) → `gain` (0-10), `bass` (0-10), `treble` (0-10), `level` (0-10)
* **`distortion_ds1`** (Distortion DS-1) → `tone` (0-10), `distortion` (0-10), `level` (0-10)
* **`drive_arena`** (Drive Arena) → `drive` (0-10), `tone` (0-10), `level` (0-10)
* **`feedback`** (Feedback Distortion) → `gain` (0-10), `tone` (0-10), `level` (0-10), `feedback` (0-10)
* **`hard_distortion`** (Hard Distortion) → `distortion` (0-10), `filter` (0-10), `volume` (0-10)
* **`lead_delay`** (Lead Delay Distortion) → `gain` (0-10), `tone` (0-10), `delay_time` (20-600ms), `delay_level` (0-10)
* **`metal_distortion`** (Metal Distortion) → `level` (0-10), `low` (0-10), `high` (0-10), `dist` (0-10), `mid` (0-10), `mid_freq` (200-5000Hz)
* **`monster_distortion`** (Monster Distortion) → `gain` (0-10), `tone` (0-10), `level` (0-10)
* **`ocd`** (OCD) → `volume` (0-10), `drive` (0-10), `tone` (0-10) | switches: `hp_lp` ("HP", "LP")
* **`overdrive_od1`** (OverDrive OD-1) → `level` (0-10), `drive` (0-10)
* **`overscream`** (OverScream TS808) → `overdrive` (0-10), `tone` (0-10), `level` (0-10)
* **`prodrive`** (PROdrive Rat) → `distortion` (0-10), `filter` (0-10), `volume` (0-10)
* **`saturator_x`** (Saturator X) → `gain` (0-10), `master` (0-10), `low` (0-10), `high` (0-10)
* **`the_ambassdor`** (The Ambass'dor Marshall Guv'nor) → `gain` (0-10), `bass` (0-10), `middle` (0-10), `treble` (0-10), `volume` (0-10)
* **`trex_moller`** (T-Rex Moller) → `drive` (0-10), `tone` (0-10), `level` (0-10), `mix` (0-100%), `boost` (0-10)
* **`trex_mudhoney`** (T-Rex Mudhoney) → `gain` (0-10), `tone` (0-10), `level` (0-10) | switches: `boost` ("OFF", "ON")

### 3. Dynamics (Compressão e Gates - 8 Pedais)
* **`black76`** (Black 76 1176LN) → `input` (0-10), `output` (0-10), `attack` (20-800us), `release` (50-1100ms) | switches: `ratio` ("4:1", "8:1", "12:1", "20:1", "ALL")
* **`compressor_cs3`** (Compressor CS-3) → `level` (0-10), `tone` (0-10), `attack` (0-10), `sustain` (0-10)
* **`dcomp`** (DComp Dyna Comp) → `output` (0-10), `sensitivity` (0-10)
* **`gate`** (Noise Gate) → `threshold` (-80 a 0dB), `release` (5-500ms)
* **`noise_killer`** (Noise Killer Decimator) → `threshold` (-80 a 0dB), `decay` (10-500ms)
* **`opto_compressor`** (Opto-Compressor) → `peak_reduction` (0-10), `gain` (0-10)
* **`swell`** (Swell Slow Gear) → `sensitivity` (0-10), `attack_time` (50-2000ms)
* **`white2a`** (White 2A LA-2A) → `peak_reduction` (0-10), `gain` (0-10) | switches: `mode` ("COMPRESS", "LIMIT")

### 4. EQ (7 Pedais)
* **`eq_10band`** (10 Band Graphic EQ MXR) → `gain_31hz` a `gain_16khz` (-12 a +12dB), `level` (-12 a +12dB)
* **`eq_7band`** (7 Band Graphic EQ Boss GE-7) → `gain_100hz` a `gain_6400hz` (-15 a +15dB), `level` (-15 a +15dB)
* **`custom_eq`** (Custom EQ 3-Band) → `low` (-15 a +15dB), `mid` (-15 a +15dB), `high` (-15 a +15dB), `mid_freq` (200-5000Hz)
* **`parametric_eq`** (Parametric EQ) → `freq` (40-16000Hz), `gain` (-18 a +18dB), `q` (0.1-10)
* **`six_band_eq`** (Six Band EQ MXR 6-Band) → `gain_100hz` a `gain_3200hz` (-18 a +18dB)
* **`trex_tonebug_eq`** (T-Rex ToneBug EQ) → `bass` (-12 a +12dB), `mid` (-12 a +12dB), `treble` (-12 a +12dB), `level` (0-10)
* **`wah_eq`** (Wah EQ) → `frequency` (200-3000Hz), `resonance` (0-10), `gain` (-12 a +12dB)

### 5. Filter (Auto-Wah e Wahs - 9 Pedais)
* **`auto_wah`** (Auto Wah) → `sensitivity` (0-10), `range` (0-10), `attack` (0-10)
* **`envelope_filter`** (Envelope Filter Q-Tron) → `sensitivity` (0-10), `decay` (0-10), `q` (0-10)
* **`filter_formant`** (Filter Formant Talk Box) → `vowel_start` (0-10), `vowel_end` (0-10), `rate` (0.1-10Hz)
* **`lfo_filter`** (LFO Filter) → `rate` (0.1-10Hz), `depth` (0-100%), `resonance` (0-10)
* **`step_filter`** (Step Filter Arpeggiator) → `tempo` (40-240bpm), `steps` (4-16), `resonance` (0-10)
* **`wah_gcb95`** (Wah Cry Baby GCB95) → `pedal` (0-100%)
* **`wah_clyde`** (Wah Clyde McCoy) → `pedal` (0-100%), `voice` (0-10)
* **`wah_slash`** (Wah Slash Custom) → `pedal` (0-100%), `gain_boost` (0-10)
* **`wah_dime_cfh`** (Wah Dime CFH) → `pedal` (0-100%), `fine_tune` (0-10), `boost` (0-10)

### 6. Fuzz (14 Pedais)
* **`big_fuzz`** (Big Fuzz Big Muff Pi) → `volume` (0-10), `tone` (0-10), `sustain` (0-10)
* **`class_fuzz`** (Class Fuzz) → `volume` (0-10), `fuzz` (0-10)
* **`fuzz_age`** (Fuzz Age) → `volume` (0-10), `fuzz` (0-10)
* **`fuzz_face_ge`** (Fuzz Face Germanium) → `volume` (0-10), `fuzz` (0-10)
* **`fuzz_face_si`** (Fuzz Face Silicon) → `volume` (0-10), `fuzz` (0-10)
* **`octafuzz`** (OctaFuzz Octavia) → `volume` (0-10), `boost` (0-10) | switches: `mode` ("FUZZ", "OCTAFUZZ")
* **`right_fuzz`** (Right Fuzz Fuzzrite) → `attack` (0-10), `level` (0-10)
* **`tone_bender_mk2`** (Tone Bender MKII) → `level` (0-10), `attack` (0-10)
* **`trex_mudhoney2`** (T-Rex Mudhoney II) → `gain` (0-10), `tone` (0-10), `level` (0-10)
* **`vintage_fuzz`** (Vintage Fuzz) → `volume` (0-10), `fuzz` (0-10), `tone` (0-10)
* **`z_fuzz_factory`** (Z-Fuzz Factory) → `volume` (0-10), `gate` (0-10), `comp` (0-10), `drive` (0-10), `stab` (0-10)
* **`hyper_fuzz`** (Hyper Fuzz FZ-2) → `level` (0-10), `gain` (0-10), `bass` (0-10), `treble` (0-10) | switches: `mode` ("FUZZ 1", "FUZZ 2", "GAIN BOOST")
* **`russian_fuzz`** (Russian Fuzz Green Russian) → `volume` (0-10), `tone` (0-10), `sustain` (0-10)
* **`triangle_fuzz`** (Triangle Fuzz 1969) → `volume` (0-10), `tone` (0-10), `sustain` (0-10)

### 7. Modulation (Chorus, Flanger, Phaser, Tremolo - 21 Pedais)
* **`analog_chorus`** (Analog Chorus Boss CE-2B) → `rate` (0.1-10Hz), `depth` (0-100%), `level` (0-100%)
* **`chorus_ce1`** (Chorus CE-1) → `depth` (0-100%), `rate` (0.1-10Hz) | switches: `mode` ("CHORUS", "VIBRATO")
* **`chorus_ce2`** (Chorus CE-2) → `rate` (0.1-10Hz), `depth` (0-100%)
* **`chorus_ensemble`** (Chorus Ensemble) → `rate` (0.1-10Hz), `depth` (0-100%), `mix` (0-100%)
* **`electric_flanger`** (Electric Flanger Electric Mistress) → `rate` (0.1-10Hz), `range` (0-10), `color` (0-10)
* **`flanger_bf2`** (Flanger BF-2) → `manual` (0-10), `depth` (0-100%), `rate` (0.1-10Hz), `resonance` (0-10)
* **`harmonic_tremolo`** (Harmonic Tremolo Fender Brownface) → `speed` (0.1-15Hz), `intensity` (0-100%), `bass_treble_mix` (0-10)
* **`nirvana`** (Nirvana Small Clone) → `rate` (0.1-10Hz) | switches: `depth` ("LOW", "HIGH")
* **`opto_tremolo`** (Opto Tremolo) → `speed` (0.1-15Hz), `depth` (0-100%)
* **`phaze_nine`** (Phaze Nine Phase 90) → `speed` (0.1-10Hz)
* **`phase_100`** (Phase 100) → `speed` (0.1-10Hz), `intensity` (1-4)
* **`pitch_vibrato`** (Pitch Vibrato) → `speed` (0.1-12Hz), `depth` (0-100%), `rise_time` (0-10)
* **`rotary_speaker`** (Rotary Speaker) → `speed` (0.1-10Hz), `drive` (0-10), `mix` (0-100%) | switches: `horn_speed` ("SLOW", "FAST")
* **`small_phazer`** (Small Phazer Small Stone) → `rate` (0.1-10Hz) | switches: `color` ("OFF", "ON")
* **`tremolo_tr2`** (Tremolo TR-2) → `wave` (0-10), `rate` (0.1-15Hz), `depth` (0-100%)
* **`univibe`** (Uni-Vibe) → `speed` (0.1-10Hz), `intensity` (0-100%), `volume` (0-10) | switches: `mode` ("CHORUS", "VIBRATO")
* **`vibrato_vb2`** (Vibrato VB-2) → `rate` (0.1-15Hz), `depth` (0-100%), `rise_time` (0-10) | switches: `mode` ("LATCH", "UNLATCH", "BYPASS")
* **`vintage_tremolo`** (Vintage Tremolo) → `speed` (0.1-15Hz), `intensity` (0-100%)
* **`trex_sweeper`** (T-Rex Sweeper Bass Chorus) → `rate` (0.1-10Hz), `depth` (0-100%), `tempo` (0-10)
* **`trex_tremster`** (T-Rex Tremster) → `speed` (0.1-15Hz), `depth` (0-100%), `volume` (0-10)
* **`trex_viper`** (T-Rex Viper Classic Vibe) → `speed` (0.1-10Hz), `depth` (0-100%), `level` (0-10)

### 8. Pitch (8 Pedais)
* **`harmonizer`** (Harmonizer Eventide H910) → `shift` (-24 a +24 semitons), `mix` (0-100%), `harmony_scale` (0-7)
* **`octav`** (Octav Boss OC-2) → `direct_level` (0-10), `oct1_level` (0-10), `oct2_level` (0-10)
* **`pitch_shifter_ps5`** (Pitch Shifter PS-5) → `balance` (0-100%), `pitch` (-24 a +24), `fine` (-50 a +50 cents)
* **`wharmonator`** (Wharmonator DigiTech Whammy) → `pedal` (0-100%) | switches: `mode` ("+2 OCT", "+1 OCT", "-1 OCT", "-2 OCT", "DETUNE", "5TH UP")
* **`wham_5`** (Wham-5 Whammy V) → `pedal` (0-100%)
* **`octa_switch`** (Octa-Switch POG) → `sub_oct` (0-10), `upper_oct` (0-10), `dry` (0-10)
* **`micro_synth`** (Micro Synth) → `trigger` (0-10), `sub_octave` (0-10), `guitar` (0-10), `octave` (0-10), `square` (0-10), `attack_delay` (0-10), `resonance` (0-10), `start_freq` (0-10), `stop_freq` (0-10), `rate` (0-10)
* **`detune`** (Detune Spatial) → `detune_amount` (-50 a +50 cents), `mix` (0-100%)

### 9. Reverb (6 Pedais)
* **`digital_reverb`** (Digital Reverb RV-5) → `time` (0.1-10s), `tone` (0-10), `mix` (0-100%) | switches: `mode` ("HALL", "ROOM", "PLATE", "SPRING")
* **`hall_reverb`** (Hall Reverb) → `decay` (0.5-8s), `predelay` (0-100ms), `mix` (0-100%)
* **`plate_reverb`** (Plate Reverb EMT 140) → `time` (0.2-6s), `damping` (0-10), `mix` (0-100%)
* **`reverb_63`** (Reverb '63 Fender Spring Tank) → `dwell` (0-10), `tone` (0-10), `mix` (0-100%)
* **`spring_reverb`** (Spring Reverb) → `time` (0.5-5s), `mix` (0-100%)
* **`studio_reverb`** (Studio Reverb Lexicon 480L) → `decay` (0.1-10s), `high_cut` (1000-15000Hz), `mix` (0-100%)

### 10. Other / Utility (4 Pedais)
* **`volume_pedal`** (Volume Pedal) → `pedal` (0-100%)
* **`buffer_booster`** (Buffer Booster) → `boost` (0-20dB)
* **`ab_switch`** (A/B Switch) → switches: `channel` ("A", "B", "A+B")
* **`stereo_panner`** (Stereo Panner) → `rate` (0.1-10Hz), `width` (0-100%)
