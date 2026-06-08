# SPA Framework

Lehký a modulární framework pro vytváření jednostránkových aplikací (SPA) v TypeScriptu. Framework poskytuje základní architekturu pro směrování, správu komponent a reaktivitu bez zbytečné komplexnosti.

## Klíčové vlastnosti

### 🎯 Komponenty a web komponenty
Framework staví na standardních web komponentech (`HTMLElement`). Každá komponenta je třída rozšiřující `Component`, která automaticky zvládá:
- Inicializaci stavu (`setState`)
- Synchronizaci s DOM (`update`)
- Správu životního cyklu (`connectedCallback`, `disconnectedCallback`)
- Registraci a odhlašování event listenerů
- Datavý binding na formuláře

### 📄 Stránky (Pages) a rozložení (Layouts)
- **Pages** rozšiřují `Component` a představují obsah jednotlivých cest v aplikaci
- **Layouts** obalují pages a poskytují konzistentní strukturu (header, footer, navigace)
- Pages se automaticky vkládají do slotu layoutu

### 🛣️ Routing
Jednoduchý klient-side router bez závislostí:
- Definování tras v JSON konfiguraci
- Parametrické routy (např. `/user/:id`)
- Automatické zpracování `<a>` odkazů
- Middleware podpora pro validaci navigace

### 🌐 Event dispatcher
Globální event systém pro komunikaci mezi komponentami bez prop drilling:
- `emit(eventName, data)` — vyslání globální události
- `listen(eventName, callback)` — poslech globální události
- Automatické čištění listenerů při odpojení komponenty

### 📋 Reaktivita a binding
- **State management**: `setState()` automaticky triggeruje re-render
- **Form binding**: `bind:value` atribut pro dvousměrnou vazbu na formulářové prvky
- **Data binding**: `{{expression}}` syntaxe pro interpolaci dat v HTML

### 🔌 Plugin systém
Rozšiřitelnost přes pluginy:
```typescript
app.plugin(new MyPlugin());
```
Pluginy mají přístup k instanci App a mohou manipulovat jejím chováním.

### 🎨 Kompatibilita s Tailwind CSS
Framework je připravený na práci s Tailwind CSS. Přímo se integřuje s `@tailwindcss/vite` pluginem.

## Instalace

```bash
npm install @VaclavKozelka-OpenSource/spa-framework
```

## Běžné operace

### Vytvoření komponenty
```typescript
import { Component } from '@VaclavKozelka-OpenSource/spa-framework';

export class MyComponent extends Component {
  render() {
    return `<div class="my-component">Obsah</div>`;
  }
}

customElements.define('my-component', MyComponent);
```

### Vytvoření stránky
```typescript
import { Page } from '@VaclavKozelka-OpenSource/spa-framework';

export class HomePage extends Page {
  render() {
    return `
      <h1>Úvodní stránka</h1>
      <p>Vítejte v aplikaci</p>
    `;
  }
}

customElements.define('home-page', HomePage);
```

### Vytvoření layoutu
```typescript
import { Layout } from '@VaclavKozelka-OpenSource/spa-framework';

export class MainLayout extends Layout {
  render() {
    return `
      <header>Navigace</header>
      <main><slot></slot></main>
      <footer>Patička</footer>
    `;
  }
}

customElements.define('main-layout', MainLayout);
```

## Architektura

```
App (bootstrapping)
  └── Router (routing)
      ├── Middleware (validace navigace)
      └── Rendering
          ├── Layout
          │   └── Page
          │       └── Components
```

- **App**: Hlavní instance, spravuje middlewares a deleguje navigaci
- **Router**: Mapuje URL na routes, vykresluje příslušné pages s layouty
- **Middleware**: Hooks pro validaci nebo transformaci navigace
- **Components**: Opakovaně použitelné UI prvky
- **Pages**: Obsah specifický pro danou routu
- **Layouts**: Obalení pro konzistentní strukturu

## API Reference

### App
- `new App(router)` — inicializace
- `app.use(middleware)` — registrace middlewaru
- `app.plugin(plugin)` — registrace pluginu
- `app.boot()` — spuštění aplikace

### Router
- `new Router(routes)` — inicializace s konfigurací tras
- `router.routeToPath(path)` — navigace na cestu

### Navigation
- `path(routeName, params?)` — generování URL z názvu routy
- `setRoutes(routes)` — nastavení tras (musí se volat před vytvořením Routeru)

### Component, Layout, Page
- `render(): string` — vrací HTML obsah
- `setState(state)` — aktualizace stavu a re-render
- `state` — read-only přístup k aktuálnímu stavu
- `emit(eventName, data)` — vyslání globální události
- `listen(eventName, callback)` — poslech globální události
- `on(eventName, callback)` — registrace lokálního event listeneru
- `off(eventName, callback)` — odhlášení lokálního event listeneru

### EventDispatcher
- `dispatcher.emit(eventName, data)` — vyslání globální události
- `dispatcher.on(eventName, callback)` — poslech globální události
- `dispatcher.off(eventName, callback)` — odhlášení

## Příklad aplikace

Viz [`spa-skeleton`](../spa-skeleton) — je to připravená základna pro nový projekt.

## Vývoj frameworku

```bash
npm run typecheck    # Kontrola typů
```

## Licence

MIT — viz [LICENSE.md](./LICENSE.md)
