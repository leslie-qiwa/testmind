# 🧠 Logic & Word Games Hub

A modern, interactive website featuring two engaging brain games: **Codebreak** and **Word Search**. Built with vanilla HTML, CSS, and JavaScript for easy deployment on GitHub Pages.

## 🎮 Games

### 🎯 Codebreak
- **Objective**: Crack the secret 4-color code within 10 attempts
- **How to play**: 
  - Click on empty pegs to select them
  - Choose colors from the palette
  - Submit your guess to get feedback
  - 🔴 Red peg = Correct color in correct position
  - ⚪ White peg = Correct color in wrong position
- **Features**: Timer, attempt counter, best time tracking, game history

### 🔍 Word Search
- **Objective**: Find all hidden words in the letter grid
- **How to play**:
  - Click and drag to select letters
  - Words can be horizontal, vertical, or diagonal
  - Found words are marked in the word list
- **Features**: Multiple themes (animals, colors, fruits, countries), timer, progress tracking

## ✨ Features

- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Local Storage**: Saves best times and game progress
- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **GitHub Pages Ready**: Optimized for static hosting

## 🚀 Deployment to GitHub Pages

### Option 1: Quick Deploy (Recommended)

1. **Create a new repository** on GitHub
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `your-username.github.io` (replace with your actual username)
   - Make it public

2. **Upload your files**
   - Clone the repository to your local machine
   - Copy all files from this project to the repository folder
   - Commit and push to GitHub

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access your site**
   - Your site will be available at `https://your-username.github.io`

### Option 2: Project Repository

1. **Create a regular repository** (any name)
2. **Upload your files** as above
3. **Enable GitHub Pages** in settings
4. **Your site will be at** `https://your-username.github.io/repository-name`

## 📁 File Structure

```
game-website/
├── index.html              # Main dashboard HTML file
├── styles.css              # All CSS styles
├── script.js               # Dashboard functionality
├── codebreaking/           # Codebreak game directory
│   ├── index.html          # Codebreak game HTML
│   └── codebreak.js        # Codebreak game logic
├── wordsearch/             # Word Search game directory
│   ├── index.html          # Word Search game HTML
│   └── wordsearch.js       # Word Search game logic
└── README.md               # This file
```

## 🎨 Customization

### Adding New Games
1. Create a new directory for your game (e.g., `newgame/`)
2. Create `index.html` and `game.js` files in the new directory
3. Add game card to the main dashboard (`index.html`)
4. Link the game card to your new game directory
5. Add corresponding styles in `styles.css` if needed

### Modifying Word Search Themes
Edit the `wordLists` object in the `WordSearchGame` class:

```javascript
const wordLists = {
    your_theme: ['WORD1', 'WORD2', 'WORD3', ...],
    // Add more themes here
};
```

### Changing Colors
Update the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* Add more custom colors */
}
```

## 🔧 Local Development

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Start playing!** No server required

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🤝 Contributing

Feel free to fork this project and add your own games or improvements!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Enjoy playing! 🎉** 