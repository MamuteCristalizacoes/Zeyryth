// Internationalization (i18n) for Zeyryth'Studio
export type Language = 'pt' | 'en';

export const translations = {
  pt: {
    // Navigation
    home: 'Início',
    tutorials: 'Tutoriais',
    textures: 'Texturas',
    colorCollector: 'Coletor de Cores',
    palettes: 'Paletas',
    chat: 'Chat',
    profile: 'Perfil',
    admin: 'Admin',
    logout: 'Sair',
    login: 'Entrar',

    // Home page
    welcome: 'Bem-vindo ao Zeyryth\'Studio',
    subtitle: 'Dicas e tutoriais para esculpir e desenhar no SmallWords',
    exploreTextures: 'Explorar Texturas',
    collectColors: 'Coletor de Cores',
    sharePalettes: 'Compartilhar Paletas',
    joinChat: 'Entrar no Chat',

    // Color Collector
    colorCollectorTitle: 'Coletor de Cores',
    dragImageHere: 'Arraste uma imagem aqui',
    pickColor: 'Clique para selecionar uma cor',
    colorCode: 'Código da Cor',
    saveColor: 'Salvar Cor',
    savedColors: 'Cores Salvas',
    colorName: 'Nome da Cor',
    deleteColor: 'Deletar Cor',

    // Palettes
    paletteTitle: 'Paletas de Cores',
    createPalette: 'Criar Paleta',
    paletteName: 'Nome da Paleta',
    paletteDescription: 'Descrição',
    savePalette: 'Salvar Paleta',
    sharePalette: 'Compartilhar',
    deletePalette: 'Deletar',
    makePublic: 'Tornar Pública',
    makePrivate: 'Tornar Privada',

    // Textures
    textureGallery: 'Galeria de Texturas',
    marble: 'Mármore',
    wood: 'Madeira',
    skin: 'Pele',
    gradient: 'Degradê',
    shading: 'Sombreado',
    tutorial: 'Tutorial',
    stepByStep: 'Passo a Passo',
    viewTutorial: 'Ver Tutorial',

    // Chat
    chatTitle: 'Chat da Comunidade',
    typeMessage: 'Digite uma mensagem...',
    send: 'Enviar',
    shareColor: 'Compartilhar Cor',
    shareTexture: 'Compartilhar Textura',
    noMessages: 'Nenhuma mensagem ainda',

    // Community
    community: 'Comunidade',

    // Profile
    profileTitle: 'Meu Perfil',
    editProfile: 'Editar Perfil',
    myTags: 'Minhas Tags',
    artist: 'Artista',
    sculptor: 'Escultor',
    professionalArtist: 'Artista Profissional',
    contributor: 'Contribuidor',
    moderator: 'Moderador',

    // Admin
    adminPanel: 'Painel de Administração',
    manageUsers: 'Gerenciar Usuários',
    assignTags: 'Atribuir Tags',
    viewReports: 'Ver Relatórios',
    userList: 'Lista de Usuários',
    addTag: 'Adicionar Tag',
    removeTag: 'Remover Tag',

    // Common
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    cancel: 'Cancelar',
    save: 'Salvar',
    delete: 'Deletar',
    edit: 'Editar',
    close: 'Fechar',
    search: 'Pesquisar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    noResults: 'Nenhum resultado encontrado',
  },
  en: {
    // Navigation
    home: 'Home',
    tutorials: 'Tutorials',
    textures: 'Textures',
    colorCollector: 'Color Collector',
    palettes: 'Palettes',
    chat: 'Chat',
    profile: 'Profile',
    admin: 'Admin',
    logout: 'Logout',
    login: 'Login',

    // Home page
    welcome: 'Welcome to Zeyryth\'Studio',
    subtitle: 'Tips and tutorials for sculpting and drawing in SmallWords',
    exploreTextures: 'Explore Textures',
    collectColors: 'Color Collector',
    sharePalettes: 'Share Palettes',
    joinChat: 'Join Chat',

    // Color Collector
    colorCollectorTitle: 'Color Collector',
    dragImageHere: 'Drag an image here',
    pickColor: 'Click to pick a color',
    colorCode: 'Color Code',
    saveColor: 'Save Color',
    savedColors: 'Saved Colors',
    colorName: 'Color Name',
    deleteColor: 'Delete Color',

    // Palettes
    paletteTitle: 'Color Palettes',
    createPalette: 'Create Palette',
    paletteName: 'Palette Name',
    paletteDescription: 'Description',
    savePalette: 'Save Palette',
    sharePalette: 'Share',
    deletePalette: 'Delete',
    makePublic: 'Make Public',
    makePrivate: 'Make Private',

    // Textures
    textureGallery: 'Texture Gallery',
    marble: 'Marble',
    wood: 'Wood',
    skin: 'Skin',
    gradient: 'Gradient',
    shading: 'Shading',
    tutorial: 'Tutorial',
    stepByStep: 'Step by Step',
    viewTutorial: 'View Tutorial',

    // Chat
    chatTitle: 'Community Chat',
    typeMessage: 'Type a message...',
    send: 'Send',
    shareColor: 'Share Color',
    shareTexture: 'Share Texture',
    noMessages: 'No messages yet',

    // Community
    community: 'Community',

    // Profile
    profileTitle: 'My Profile',
    editProfile: 'Edit Profile',
    myTags: 'My Tags',
    artist: 'Artist',
    sculptor: 'Sculptor',
    professionalArtist: 'Professional Artist',
    contributor: 'Contributor',
    moderator: 'Moderator',

    // Admin
    adminPanel: 'Admin Panel',
    manageUsers: 'Manage Users',
    assignTags: 'Assign Tags',
    viewReports: 'View Reports',
    userList: 'User List',
    addTag: 'Add Tag',
    removeTag: 'Remove Tag',

    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    noResults: 'No results found',
  },
};

export const getTranslation = (lang: Language, key: keyof typeof translations.pt): string => {
  return (translations[lang] as any)[key] || (translations.pt as any)[key];
};
