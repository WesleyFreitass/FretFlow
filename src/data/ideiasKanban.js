// =========================================================================
// DATASET DO KANBAN DE IDEIAS DO FRETFLOW (ACESSO COMPARTILHADO: USUÁRIO & IA)
// =========================================================================

export const KANBAN_COLUMNS = [
  {
    id: 'novas',
    title: 'Novas',
    subtitle: 'Sugestões & Backlog',
    color: '#3b82f6', // Azul
    badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    headerBorder: '#3b82f6'
  },
  {
    id: 'em_analise',
    title: 'Em Análise',
    subtitle: 'Arquitetura & Viabilidade',
    color: '#8b5cf6', // Roxo
    badgeClass: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    headerBorder: '#8b5cf6'
  },
  {
    id: 'em_desenvolvimento',
    title: 'Em Desenvolvimento',
    subtitle: 'Codificação Ativa',
    color: '#f59e0b', // Âmbar / Laranja
    badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    headerBorder: '#f59e0b'
  },
  {
    id: 'polimento',
    title: 'Polimento',
    subtitle: 'Testes, UX & Ajustes Finos',
    color: '#06b6d4', // Ciano
    badgeClass: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
    headerBorder: '#06b6d4'
  },
  {
    id: 'concluido',
    title: 'Concluído',
    subtitle: 'Pronto & Entregue no App',
    color: '#10b981', // Verde Esmeralda
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    headerBorder: '#10b981'
  },
  {
    id: 'cancelada',
    title: 'Cancelada',
    subtitle: 'Descartada ou Substituída',
    color: '#ef4444', // Vermelho / Rosa
    badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    headerBorder: '#ef4444'
  }
];

export const KANBAN_PRIORITIES = [
  { id: 'baixa', label: 'Baixa', color: '#6b7280', badgeClass: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30' },
  { id: 'media', label: 'Média', color: '#3b82f6', badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  { id: 'alta', label: 'Alta', color: '#f59e0b', badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  { id: 'critica', label: 'Crítica', color: '#ef4444', badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/30' }
];

export const KANBAN_AUTHORS = [
  { id: 'wesley', name: 'Wesley', role: 'Usuário / Dev', icon: '👤', badgeClass: 'bg-oficina-terracotta/20 text-oficina-terracotta border-oficina-terracotta/40' },
  { id: 'antigravity', name: 'Antigravity AI', role: 'Assistente IA', icon: '🤖', badgeClass: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40' }
];

export const KANBAN_CATEGORIES = [
  { id: 'melhoria', label: 'Melhoria', icon: '✨', color: '#3b82f6', badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  { id: 'polimento', label: 'Polimento', icon: '💎', color: '#06b6d4', badgeClass: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30' },
  { id: 'bug', label: 'Bug', icon: '🐛', color: '#ef4444', badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/30' },
  { id: 'nova_guia', label: 'Melhoria Nova Guia', icon: '🚀', color: '#ea580c', badgeClass: 'bg-orange-500/15 text-orange-600 border-orange-500/30' }
];

export const KANBAN_TAGS = [
  'Afinador',
  'Pedaleira & Efeitos',
  'Treino de Acordes',
  'Trilha & Métodos',
  'Escalas & Modos',
  'Guitar Pro Tabs',
  'Arcade de Notas (Hero)',
  'Modo YouTube',
  'Kanban de Ideias',
  'NOVA GUIA'
];

// Ideias e Features Oficiais Cadastradas no Kanban do FretFlow
export const INITIAL_IDEAS = [
  // =========================================================================
  // 1. EM DESENVOLVIMENTO
  // =========================================================================
  {
    id: 'feat_4_1',
    title: '4.1. Speed Trainer de Troca de Acordes (Metrônomo Adaptativo no ChordTrainer)',
    description: 'Treino de agilidade de transição de acordes difíceis no Treino de Acordes com metrônomo adaptativo que sobe +2 BPM a cada 5 trocas limpas consecutivas validadas por correlação de cromagrama.',
    category: 'melhoria',
    gains: `• Foco na Principal Dor do Iniciante: Resolve a lentidão na transição entre acordes com pestana (F, Bm) e formatos abertos (C, G, D).
• Progressão Automatizada: O andamento sobe sozinho (+2 BPM a cada 5 trocas limpas), criando um ciclo viciante de superação sem necessidade de ajuste manual.
• Validação Harmônica por DSP: O algoritmo de correlação de cromagrama só valida quando todas as notas do acorde soam limpas, prevenindo cordas abafadas por erro postural.
• Impacto de Priorização: Alta — Acelera a transição de iniciante para intermediário em tempo recorde.`,
    status: 'em_desenvolvimento',
    priority: 'alta',
    author: 'wesley',
    tags: ['Treino de Acordes'],
    createdAt: '2026-09-04T10:42:00.000Z'
  },
  {
    id: 'feat_4_3',
    title: '4.3. Dicionário Reverso de Acordes & Escalas Compatíveis',
    description: 'Identificar o nome exato do acorde tocado na guitarra real ou selecionado no braço virtual (incluindo extensões 7M, 9, 13, drop-2) e sugerir instantaneamente escalas para solo.',
    category: 'melhoria',
    gains: `• Descoberta Harmônica Espontânea: O músico descobre um formato no braço de ouvido e o app informa na hora o nome teórico formal (ex: D7M(9)/F#).
• Ponte Direta para Improvisação: Ao identificar o acorde, sugere instantaneamente as escalas compatíveis (Pentatônica, Modos Gregos, Menor Melódica) para solar por cima.
• Apoio à Composição: Ajuda compositores a encontrar substituições harmônicas e notas de tensão ricas.
• Impacto de Priorização: Média — Valor educacional contínuo para estudo de harmonia e improvisação.`,
    status: 'em_desenvolvimento',
    priority: 'media',
    author: 'wesley',
    tags: ['Treino de Acordes', 'Escalas & Modos'],
    createdAt: '2026-09-04T10:43:00.000Z'
  },

  // =========================================================================
  // 2. NOVAS (Backlog Ativo & Priorizado)
  // =========================================================================
  {
    id: 'feat_4_6',
    title: '4.6. Suporte Universal a Afinações Alternativas (Global no Topo)',
    description: 'Seletor global de afinação no topo do app (Padrão, Drop D, DADGAD, Open D, Meio Tom Abaixo / Eb, Open G) propagando dinamicamente a afinação das 6 cordas para o Afinador, Braço de Escalas, Dicionário de Acordes e Tablaturas.',
    category: 'melhoria',
    gains: `• Eliminação Total de Atrito: O guitarrista troca a afinação do app em 1 clique sem precisar recalcular notas manualmente módulo por módulo.
• Expansão Imediata de Repertório: Habilita tocar clássicos do Metal/Hard Rock (Drop D, Eb Standard), Fingerstyle/Folk (DADGAD, Open D) e Blues (Open G).
• Coerência de Sistema: Sincroniza a matriz matemática das 6 cordas no Afinador, Braço de Escalas, Dicionário e Tablaturas.
• Impacto de Priorização: Crítico — É o pilar fundamental para que todos os outros módulos funcionem com músicas reais de diferentes afinações.`,
    status: 'novas',
    priority: 'critica',
    author: 'wesley',
    tags: ['Afinador', 'Escalas & Modos', 'Treino de Acordes', 'Guitar Pro Tabs'],
    createdAt: '2026-09-04T10:40:00.000Z'
  },
  {
    id: 'feat_3_1',
    title: '3.1. Modo "Nota por Nota" (Wait Mode - Guitar Pro & Hero)',
    description: 'O player pausa a reprodução na nota/acorde atual da partitura no Guitar Pro ou pista 3D e só avança para o próximo compasso quando o pitch detector confirma a execução correta da corda e casa na guitarra real.',
    category: 'melhoria',
    gains: `• Estudo Sem Frustração: O aluno iniciante ou intermediário nunca é atropelado pela velocidade da música; o app espera pacientemente o acerto da nota física.
• Precisão Muscular Imediata: Elimina o vício prejudicial de tocar notas 'sujas' ou erradas apenas para acompanhar o metrônomo às pressas.
• Diferencial de Mercado nº 1: Funcionalidade mais elogiada e responsável pela retenção de alunos no Yousician e Rocksmith.
• Impacto de Priorização: Crítico — Transforma o player de partituras em um professor interativo em tempo real.`,
    status: 'novas',
    priority: 'critica',
    author: 'wesley',
    tags: ['Guitar Pro Tabs', 'Arcade de Notas (Hero)'],
    createdAt: '2026-09-04T10:46:00.000Z'
  },
  {
    id: 'feat_3_2',
    title: '3.2. Riff Repeater com Auto-Aceleração de BPM (Rocksmith)',
    description: 'Repetição em loop de trechos com incremento progressivo de velocidade (+5% de BPM ao atingir 100% de acertos) utilizando time-stretching com preservação de pitch.',
    category: 'melhoria',
    gains: `• Domínio Cirúrgico de Solos: Isola os 4 compassos mais difíceis da música e repete em loop contínuo até a perfeição muscular.
• Preservação Tonal Perfeita: Time-stretching permite desacelerar para 50% sem mudar o tom da música (sem distorção de frequência).
• Economia de Tempo de Treino: Reduz em até 70% o tempo necessário para destravar passagens rápidas e técnicas de palhetada alternada.
• Impacto de Priorização: Alta — Recurso obrigatório para qualquer estudante sério de guitarra.`,
    status: 'novas',
    priority: 'alta',
    author: 'wesley',
    tags: ['Guitar Pro Tabs', 'Modo YouTube'],
    createdAt: '2026-09-04T10:41:00.000Z'
  },
  {
    id: 'feat_4_8',
    title: '4.8. Biblioteca de Presets com Vínculo Direto a Músicas',
    description: 'Vincular timbres oficiais e da comunidade a cada música do repertório (ex: carregar Back in Black e acionar o botão "Carregar Timbre Sugerido" para configurar a pedaleira e amp no timbre exato).',
    category: 'melhoria',
    gains: `• Timbre Correto Instantâneo: Carregue a tablatura de uma música e configure a pedaleira e amplificador no som característico da banda em 1 clique.
• Compartilhamento Social: Usuários podem criar, votar e baixar os presets de timbres mais fiéis criados pela comunidade.
• Zero Perda de Tempo em Ajustes: O guitarrista foca na técnica e no repertório em vez de gastar horas caçando regulagens em fóruns.
• Impacto de Priorização: Alta — Unifica a experiência sonora da pedaleira com o repertório de tablaturas.`,
    status: 'novas',
    priority: 'alta',
    author: 'wesley',
    tags: ['Pedaleira & Efeitos', 'Guitar Pro Tabs'],
    createdAt: '2026-09-04T10:38:00.000Z'
  },
  {
    id: 'feat_3_7',
    title: '3.7. Autoavaliação "Listen Back" (Gravação da Performance)',
    description: 'Gravação em buffer local temporário da guitarra do usuário durante a prática, permitindo escutar a própria execução isolada ou mixada com a backing track após a música.',
    category: 'melhoria',
    gains: `• Desenvolvimento Crítico de Ouvido: Ao tocar, o cérebro foca na mecânica dos dedos; ouvir a própria gravação logo após revela falhas rítmicas e de dinâmica imperceptíveis ao vivo.
• Sem Atrito de DAW: Grava em segundo plano sem precisar abrir programas externos, configurar pistas ou apertar botões adicionais.
• Mixagem Comparativa: Permite ouvir a guitarra solo pura para checar afinação e timbre, ou na mix com a banda para checar entrosamento rítmico.
• Impacto de Priorização: Média — Ferramenta didática indispensável para autoaperfeiçoamento técnico.`,
    status: 'novas',
    priority: 'media',
    author: 'wesley',
    tags: ['Guitar Pro Tabs', 'Arcade de Notas (Hero)'],
    createdAt: '2026-09-04T10:45:00.000Z'
  },
  {
    id: 'feat_3_5',
    title: '3.5. Diagnóstico de Precisão (Pitch Tonal vs. Ritmo/Timing Delta ms)',
    description: 'Relatório pós-sessão decompondo o score em Precisão de Frequência (cents) e Janela de Timing em ms (Perfect < 30ms, Good < 70ms, Late/Early > 70ms), indicando se o músico tende a correr ou arrastar.',
    category: 'melhoria',
    gains: `• Diagnóstico Preciso de Técnica: Revela com exatidão se o aluno errou por afinação (bend curto, dedo frouxo) ou por ritmo (tendência a adiantar ou atrasar o tempo).
• Métrica Profissional em Milissegundos: Janelas objetivas de timing ensinam a tocar 'no bolso' (in the pocket) como músicos de estúdio.
• Feedback Construtivo: Emite dicas personalizadas de correção de palheta ou regulagem do instrumento pós-música.
• Impacto de Priorização: Média — Eleva a avaliação do app do nível recreativo para o padrão de ensino profissional.`,
    status: 'novas',
    priority: 'media',
    author: 'wesley',
    tags: ['Arcade de Notas (Hero)', 'Trilha & Métodos'],
    createdAt: '2026-09-04T10:33:00.000Z'
  },
  {
    id: 'feat_4_4',
    title: '4.4. Modo Jam com Backing Tracks Adaptativas e Target Notes',
    description: 'Gerador procedural de backing tracks (Bateria + Baixo) com escala iluminada no braço da guitarra e destaque luminoso nas "notas alvo" que coincidem com o acorde executado pelo baixo no compasso.',
    category: 'nova_guia',
    gains: `• Domínio Prático de Improvisação: Ensina o guitarrista a não ficar preso em digitações mecânicas, destacando as 'Target Notes' que valorizam a harmonia do momento.
• Variedade Musical Infinita: Gera bases de Blues, Rock, Funk e Jazz que mudam de progressão dinamicamente.
• Conexão Visual Intuitiva: Iluminação dinâmica no braço que ensina a enxergar as notas da tríade e tétrade sobrepostas à escala pentatônica.
• Impacto de Priorização: Média — Nova Guia com alto apelo para guitarristas que desejam solar com musicalidade e intenção.`,
    status: 'novas',
    priority: 'media',
    author: 'wesley',
    tags: ['NOVA GUIA', 'Escalas & Modos'],
    createdAt: '2026-09-04T10:35:00.000Z'
  },
  {
    id: 'feat_4_5',
    title: '4.5. Ear Training Contextual com Resposta no Instrumento Real',
    description: 'Módulo de percepção auditiva onde o app toca notas, intervalos ou progressões harmônicas e o usuário deve encontrar e reproduzir os mesmos sons diretamente na guitarra real usando pitch detection.',
    category: 'nova_guia',
    gains: `• Conexão Ouvido-Instrumento Direta: O aluno não marca alternativas na tela; ele ouve o som e acha a nota na guitarra real, treinando o reflexo imediato.
• Aceleração para Tirar Músicas de Ouvido: Transfere a percepção intervalar diretamente para a memória muscular e visual das cordas e casas.
• Validação Auditiva Instantânea: Resposta imediata por pitch detection com confirmação visual verde (acerto) ou vermelha (erro).
• Impacto de Priorização: Média — Nova Guia revolucionária que substitui aplicativos chatos de teoria auditiva por prática real no instrumento.`,
    status: 'novas',
    priority: 'media',
    author: 'wesley',
    tags: ['NOVA GUIA', 'Trilha & Métodos'],
    createdAt: '2026-09-04T10:36:00.000Z'
  },
  {
    id: 'feat_4_9',
    title: '4.9. Heatmap de Precisão e Relatório Diagnóstico no Braço',
    description: 'Dashboard analítico exibindo um mapa de calor no braço da guitarra (zonas verdes = consolidadas, zonas vermelhas = falhas de técnica) com gerador automático de rotina de treino personalizada de 10 min.',
    category: 'melhoria',
    gains: `• Raio-X Visual do Desempenho: Mapa de calor do braço aponta exatamente em quais cordas, casas e regiões ocorrem os maiores índices de notas erradas.
• Rotinas Customizadas Automatizadas: Cria um treino diário sob medida de 10 minutos direcionado exclusivamente para corrigir as fraquezas identificadas.
• Acompanhamento Tangível de Evolução: Mostra as zonas vermelhas se transformando em verdes com o passar das semanas.
• Impacto de Priorização: Média — Otimiza o tempo de estudo do usuário com aprendizado adaptativo baseado em dados.`,
    status: 'novas',
    priority: 'media',
    author: 'wesley',
    tags: ['Trilha & Métodos', 'Escalas & Modos'],
    createdAt: '2026-09-04T10:39:00.000Z'
  },
  {
    id: 'feat_3_6',
    title: '3.6. Sistema de Streaks e Metas Diárias (15 min Ativos)',
    description: 'Contador de dias consecutivos de estudo que só avança quando o guitarrista cumpre 15 minutos com sinal real captado e validado no microfone/interface.',
    category: 'melhoria',
    gains: `• Construção de Hábito Sólido: Aumenta a consistência de estudo através do efeito psicológico de não quebrar a sequência de dias consecutivos.
• Validação por Áudio Real: Impossível trapacear deixando o app aberto; o cronômetro só conta quando há som de guitarra sendo tocado de verdade.
• Retenção e Engajamento a Longo Prazo: Multiplica o tempo de uso diário e transforma o aprendizado em rotina natural.
• Impacto de Priorização: Baixa — Essencial para a camada de gamificação e fidelização do usuário.`,
    status: 'novas',
    priority: 'baixa',
    author: 'wesley',
    tags: ['Trilha & Métodos'],
    createdAt: '2026-09-04T10:44:00.000Z'
  },
  {
    id: 'feat_4_2',
    title: '4.2. Looper A-B com Transposição e Pitch Shifter (Phase Vocoder)',
    description: 'Permitir transpor o áudio em semitons sem alterar o BPM (ex: tocar músicas em Eb padrão na guitarra em E sem precisar desafinar) com indicação automática de capotraste virtual.',
    category: 'melhoria',
    gains: `• Praticidade sem Reafinar a Guitarra: Permite praticar músicas de Guns N' Roses, Jimi Hendrix ou SRV (afinados em meio tom abaixo) mantendo sua guitarra na afinação padrão E.
• Loop A-B de Alta Fidelidade: Permite demarcar trechos milimetricamente para repetição contínua de licks complexos.
• Impacto de Priorização: Baixa — Conveniência para quem estuda músicas gravadas em afinações não padronizadas.`,
    status: 'novas',
    priority: 'baixa',
    author: 'wesley',
    tags: ['Guitar Pro Tabs', 'Modo YouTube'],
    createdAt: '2026-09-04T10:34:00.000Z'
  },

  // =========================================================================
  // 3. CONCLUÍDO (Entregue & Operacional no App)
  // =========================================================================
  {
    id: 'feat_2_1',
    title: '2.1. Modo Arcade Guitar Hero (Songsterr Tab + YouTube Oficial Sincronizado)',
    description: 'Pista 3D em perspectiva (Highway) com 6 cordas reais, extração automática da faixa estrita de guitarra via Songsterr API, detecção de palhetada por microfone, sincronização com o vídeo oficial do YouTube via offset e micro-ajuste de latência ±0.1s.',
    category: 'melhoria',
    gains: `• Mapeamento Fiel da Guitarra Real: Cada nota da tablatura desce exatamente na corda física correspondente com indicação de casa.
• Sincronia Precisa de Áudio e Vídeo: Compensa intros de vídeo com offset calibrado e ajuste fino em tempo real.
• Experiência Completa: Gamificação arcade imersiva sem necessidade de arquivos externos manuais.
• Impacto de Priorização: Crítica (Entregue) — Principal atração visual e interativa da plataforma.`,
    status: 'concluido',
    priority: 'critica',
    author: 'wesley',
    tags: ['Arcade de Notas (Hero)', 'Modo YouTube'],
    createdAt: '2026-09-04T10:30:00.000Z'
  },
  {
    id: 'idea_1788560007176_qr1u4',
    title: 'Polimentos no Treino de Acordes',
    description: 'Categorias de estudo ocupando a tela de ponta a ponta sem ícones redundantes, ajuste de layout de tablatura e posições dos dedos sem scroll vertical e refinamento do verificador de acordes.',
    category: 'polimento',
    gains: `• Interface Fluida: Espaço de visualização 100% aproveitado sem barras de rolagem.
• Clareza Didática: Foco visual direto na digitação e nas notas que devem ou não ser tocadas.`,
    status: 'concluido',
    priority: 'alta',
    author: 'wesley',
    tags: ['Treino de Acordes'],
    createdAt: '2026-09-04T22:13:27.176Z'
  },
  {
    id: 'feat_kanban_full',
    title: 'Kanban Interativo de Ideias com Detalhamento Ampliado',
    description: 'Quadro completo de 6 colunas, drag & drop, filtros por autor/prioridade/tags, modal amplo em 2 colunas e abertura instantânea por duplo clique.',
    category: 'polimento',
    gains: `• Visibilidade e Planejamento Transparente: Centraliza todo o backlog de produto, permitindo que usuário e IA priorizem e alinhem decisões técnicas.
• Registro Rico de Especificações: Detalhamento de ganhos de negócio, passos de implementação e requisitos técnicos diretamente no app.
• Sincronização e Persistência Segura: Armazenamento robusto com versionamento automático e exportação/importação JSON.
• Impacto de Priorização: Alta (Entregue) — Conecta a visão do usuário com a execução técnica da IA de forma impecável.`,
    status: 'concluido',
    priority: 'alta',
    author: 'antigravity',
    tags: ['Kanban de Ideias'],
    createdAt: '2026-09-04T10:20:00.000Z'
  },
  {
    id: 'feat_sidebar_slide',
    title: 'Barra Lateral de Equipamentos com Deslize Suave e Padrão Recolhido',
    description: 'Faixa retrátil na lateral direita que inicia recolhida por padrão e desliza suavemente ao expandir com 110 pedais e 111 amplificadores perfeitamente alinhados.',
    category: 'polimento',
    gains: `• Aproveitamento Máximo de Área Útil: A pedaleira ganha espaço horizontal completo durante o uso, recolhendo o catálogo quando não necessário.
• Organização Exemplar de 221 Equipamentos: 110 pedais e 111 amplificadores categorizados com busca instantânea e drag & drop.
• Performance e Fluidez: Animação suave com aceleração de hardware sem impacto de renderização na reprodução de áudio.
• Impacto de Priorização: Alta (Entregue) — Conforto visual indispensável para o uso diário da pedaleira.`,
    status: 'concluido',
    priority: 'alta',
    author: 'wesley',
    tags: ['Pedaleira & Efeitos'],
    createdAt: '2026-09-04T01:30:00.000Z'
  },
  {
    id: 'feat_1_1',
    title: '1.1. Afinador Cromático de Alta Precisão (Algoritmo YIN / MPM)',
    description: 'Detecção da frequência fundamental f0 em tempo real com indicador de agulha, tolerância de cents, medição de RMS e detecção de afinação precisa em cordas graves.',
    category: 'melhoria',
    gains: `• Precisão de Afinação de Estúdio: Algoritmo YIN/MPM garante estabilidade imediata mesmo no Mi grave da guitarra com tolerância ajustável em cents.
• Base Obrigatória do Sistema: Calibra o sinal do instrumento para que todos os outros algoritmos de pitch detection operem com acurácia máxima.
• Feedback Visual Claro: Agulha cromática responsiva com indicador luminoso de afinação ideal.
• Impacto de Priorização: Crítica (Entregue) — Pilar técnico essencial da plataforma.`,
    status: 'concluido',
    priority: 'critica',
    author: 'antigravity',
    tags: ['Afinador'],
    createdAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'feat_1_2',
    title: '1.2. Pedalboard & Amplificador Virtual (110 Pedais + 111 Amps AmpliTube)',
    description: 'Processador de efeitos com 64-bit DSP, cadeia de sinal modular, controle de knobs por digitação ou mouse wheel, footswitches metálicos 3D e cabeçotes com equalizador ativo.',
    category: 'melhoria',
    gains: `• Timbre Profissional Direto no Navegador/Desktop: 110 pedais de efeitos e 111 cabeçotes modelados com processamento 64-bit sem latência.
• Ergonomia Completa de Ajustes: Knobs com suporte a ajuste fino por scroll do mouse, digitação de valores exatos e footswitches 3D com acionamento visual.
• Cadeia Modular Livre: Liberdade total para reordenar, adicionar e testar combinações de pedais em tempo real.
• Impacto de Priorização: Crítica (Entregue) — Coração sonoro da aplicação.`,
    status: 'concluido',
    priority: 'critica',
    author: 'antigravity',
    tags: ['Pedaleira & Efeitos'],
    createdAt: '2026-09-03T14:00:00.000Z'
  },
  {
    id: 'feat_1_3',
    title: '1.3. Módulo de Escalas Interativo com Validação em Tempo Real',
    description: 'Braço visual com marcações dinâmicas de Pentatônicas, Modos Gregos, CAGED e 3NPS, iluminando notas tocadas em verde (acerto) ou vermelho (fora da escala).',
    category: 'melhoria',
    gains: `• Desbloqueio da Teoria no Braço da Guitarra: Mapeia visualmente todas as formas de escalas e modos gregos ao longo de todas as casas.
• Validação Auditiva em Tempo Real: Ilumina as notas tocadas pelo usuário em verde (dentro da escala) e vermelho (fora da escala).
• Fixação Muscular Acelerada: Transforma a memorização de desenhos de escala em uma prática auditiva e visual simultânea.
• Impacto de Priorização: Crítica (Entregue) — Ferramenta central de estudo teórico aplicado.`,
    status: 'concluido',
    priority: 'critica',
    author: 'antigravity',
    tags: ['Escalas & Modos'],
    createdAt: '2026-09-02T12:00:00.000Z'
  },
  {
    id: 'feat_1_4',
    title: '1.4. Acompanhador de Partituras e Tablaturas Guitar Pro (AlphaTab)',
    description: 'Renderizador de arquivos .gp3/.gp4/.gp5/.gpx com cursor sincronizado em tempo real, controle de BPM, seleção de trechos em loop e validação por microfone.',
    category: 'melhoria',
    gains: `• Acesso a Todo o Repertório Mundial de Guitarra: Executa arquivos padrão Guitar Pro com alta fidelidade de notação e tablatura.
• Prática Guiada com Cursor em Tempo Real: Cursor visual que acompanha o compasso com controle de velocidade (BPM) e metrônomo.
• Base para o Modo Nota por Nota: Estrutura pronta para receber o algoritmo de pausa e validação interativa.
• Impacto de Priorização: Crítica (Entregue) — Player padrão da plataforma.`,
    status: 'concluido',
    priority: 'critica',
    author: 'antigravity',
    tags: ['Guitar Pro Tabs'],
    createdAt: '2026-09-02T16:00:00.000Z'
  },
  {
    id: 'feat_clean_sound',
    title: 'Preset Padrão Som Limpo Direto no Amp Base',
    description: 'Rack inicial 100% limpo (zero pedais na cadeia) indo direto para o amplificador Fender 65 Twin Reverb, sincronizado com o botão de Limpar.',
    category: 'polimento',
    gains: `• Inicialização Clara e Sem Ruídos: O app abre em som limpo e cristalino, permitindo ao usuário testar sua guitarra sem saturação excessiva.
• Facilidade para Construir Timbres: Ponto de partida ideal para o músico montar seu som passo a passo com pedais individuais.
• Fidelidade ao Amplificador Base: Valoriza as características dinâmicas do '65 Twin Reverb.
• Impacto de Priorização: Alta (Entregue) — Padrão de inicialização limpo e previsível.`,
    status: 'concluido',
    priority: 'alta',
    author: 'wesley',
    tags: ['Pedaleira & Efeitos'],
    createdAt: '2026-09-04T03:30:00.000Z'
  },
  {
    id: 'feat_json_presets',
    title: 'Importação e Exportação de Presets de Timbre em JSON',
    description: 'Sistema completo para salvar no localStorage, exportar e importar configurações de timbre via payload JSON com validação instantânea.',
    category: 'melhoria',
    gains: `• Backup e Portabilidade Total: Salve, exporte e restaure suas configurações de timbres favoritas a qualquer momento.
• Integração Direta com IA: Permite que a IA gere códigos de timbre prontos e o usuário importe com 1 clique de copiar e colar.
• Compartilhamento Fácil: Envio simplificado de timbres entre guitarristas em arquivo ou texto leve.
• Impacto de Priorização: Alta (Entregue) — Infraestrutura essencial de preservação de dados.`,
    status: 'concluido',
    priority: 'alta',
    author: 'antigravity',
    tags: ['Pedaleira & Efeitos'],
    createdAt: '2026-09-03T20:00:00.000Z'
  },

  // =========================================================================
  // 4. CANCELADA (Descartada ou Substituída)
  // =========================================================================
  {
    id: 'feat_2_2',
    title: '2.2 & 3.4. Separador de Stems com Mixer Multi-Track & Importação de Áudio Local',
    description: 'Mixer multi-track com suporte a importar arquivos locais de áudio/stems com 5-6 canais individuais (Guitarra Solo, Base, Baixo, Bateria, Voz, Outros) com controle de volume, Mute, Solo e modo Guia a -12dB.',
    category: 'nova_guia',
    gains: `• Descartado por Inviabilidade Técnica: Separadores de stems por IA no cliente demandam modelos pesados (gigabytes) inviáveis para navegador/desktop leve. O FretFlow prioriza prática ágil com tablaturas e áudio oficial.`,
    status: 'cancelada',
    priority: 'baixa',
    author: 'wesley',
    tags: ['NOVA GUIA'],
    createdAt: '2026-09-04T10:31:00.000Z'
  },
  {
    id: 'feat_4_7',
    title: '4.7. Gravador Rápido de Riffs com Exportação MIDI & MusicXML',
    description: 'Gravar ideias e solos com metrônomo, quantizar no grid e exportar instantaneamente em áudio WAV, arquivo MIDI standard (.mid) e partitura/tablatura MusicXML para Guitar Pro / MuseScore.',
    category: 'nova_guia',
    gains: `• Descartado por Fora de Escopo: A plataforma é focada em estudo, prática interativa e timbres, não atuando como DAW ou editor de notação polifônica.`,
    status: 'cancelada',
    priority: 'baixa',
    author: 'wesley',
    tags: ['NOVA GUIA', 'Guitar Pro Tabs'],
    createdAt: '2026-09-04T10:37:00.000Z'
  },
  {
    id: 'feat_3_3',
    title: '3.3. Dificuldade Adaptativa Dinâmica no Modo Game (Rocksmith+)',
    description: 'Filtragem hierárquica das notas MIDI por peso métrico. Ajustava dinamicamente a densidade durante a música.',
    category: 'melhoria',
    gains: `• Descartado em favor de Níveis Estáveis: Substituído pelos 4 níveis de dificuldade explícitos e consistentes (Iniciante, Intermediário, Tablatura Real e Guitar God), garantindo previsibilidade e clareza no aprendizado sem alterações imprevisíveis no meio da música.`,
    status: 'cancelada',
    priority: 'baixa',
    author: 'wesley',
    tags: ['Arcade de Notas (Hero)'],
    createdAt: '2026-09-04T10:32:00.000Z'
  },
  {
    id: 'feat_cab_room',
    title: 'Cab Room 3D & Troca de Microfones Virtuais',
    description: 'Espaço dedicado para escolher gabinetes avulsos e posicionar microfones virtuais na frente do cone do falante via Convolution Reverb.',
    category: 'polimento',
    gains: `• Descartado por Preciosismo: A pedaleira já conta com 110 pedais e 111 amplificadores com equalização e timbres variados. Microfonação 3D é excesso de complexidade sem ganho didático.`,
    status: 'cancelada',
    priority: 'baixa',
    author: 'antigravity',
    tags: ['Pedaleira & Efeitos'],
    createdAt: '2026-09-04T02:15:00.000Z'
  },
  {
    id: 'feat_cables',
    title: 'Cabos P10 Físicos Interligando os Pedais',
    description: 'Animação gráfica com cabos P10 conectados entre os jacks de entrada/saída de cada pedal e amplificador na pedaleira.',
    category: 'polimento',
    gains: `• Descartado por Poluição Visual: Cabos animados adicionam poluição visual e consumo de processamento sem qualquer ganho musical ou ergonômico.`,
    status: 'cancelada',
    priority: 'baixa',
    author: 'wesley',
    tags: ['Pedaleira & Efeitos'],
    createdAt: '2026-09-04T02:30:00.000Z'
  },
  {
    id: 'discard_buttons',
    title: 'Botões Alternativos de Ligar/Desligar Pedais (Conceitos A, B, C e D)',
    description: 'Testes com botões planos, chaves de alavanca e aro neon. Descartado pelo usuário para manter o footswitch metálico 3D clássico com LED.',
    category: 'polimento',
    gains: `• Decisão de Design Realista: Manteve a sensação tátil e clássica de footswitches metálicos 3D com LED, preservando a identidade boutique analógica da pedaleira.`,
    status: 'cancelada',
    priority: 'media',
    author: 'wesley',
    tags: ['Pedaleira & Efeitos'],
    createdAt: '2026-09-04T00:50:00.000Z'
  },
  {
    id: 'discard_top_btn',
    title: 'Botão Fixo de Equipamentos no Topo da Pedaleira',
    description: 'Botão no cabeçalho superior para abrir o catálogo. Descartado e removido para evitar poluição visual no topo da tela.',
    category: 'polimento',
    gains: `• Redução de Ruído Visual: Eliminou duplicações na barra superior, concentrando a expansão na barra lateral retrátil e no clique do rack vazio.`,
    status: 'cancelada',
    priority: 'baixa',
    author: 'wesley',
    tags: ['Pedaleira & Efeitos'],
    createdAt: '2026-09-04T01:40:00.000Z'
  },
  {
    id: 'discard_monolith',
    title: 'Layout Monolítico Antigo (MainStage & ToolsSideDock)',
    description: 'Arquitetura de tela única com dock lateral fixa. Descartada em favor de abas modulares independentes e limpas.',
    category: 'nova_guia',
    gains: `• Foco e Aproveitamento de Espaço: Cada ferramenta (Afinador, Pedaleira, Tabs, Jogos) agora possui 100% da área útil sem competir com painéis laterais fixos.`,
    status: 'cancelada',
    priority: 'alta',
    author: 'antigravity',
    tags: ['NOVA GUIA'],
    createdAt: '2026-09-02T10:00:00.000Z'
  }
];
