export default defineNuxtPlugin(() => {
  // Only run in browser (including production)
  if (import.meta.client) {
    // ASCII Art for BingeList
    const asciiArt = `
 ██████╗ ██╗███╗   ██╗ ██████╗ ███████╗██╗     ██╗███████╗████████╗
 ██╔══██╗██║████╗  ██║██╔════╝ ██╔════╝██║     ██║██╔════╝╚══██╔══╝
 ██████╔╝██║██╔██╗ ██║██║  ███╗█████╗  ██║     ██║███████╗   ██║   
 ██╔══██╗██║██║╚██╗██║██║   ██║██╔══╝  ██║     ██║╚════██║   ██║   
 ██████╔╝██║██║ ╚████║╚██████╔╝███████╗███████╗██║███████║   ██║   
 ╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚══════╝╚═╝╚══════╝   ╚═╝   
`

    const info = `
  🎬 Your ultimate TV show discovery and tracking platform
  📦 Version: 4.1.0
  🌐 Website: https://bingelist.app
  💻 Built with: Nuxt 4 + Vue 3 + TypeScript
  
  🎉 Thanks for using BingeList! Happy binge-watching! 🍿
`

    // Styling for the console output
    const styles = {
      art: 'color: #10b981; font-weight: bold; font-family: monospace;',
      info: 'color: #6366f1; font-size: 12px;',
      emoji: 'font-size: 14px;',
    }

    // Log to console
    console.log('%c' + asciiArt, styles.art)
    console.log('%c' + info, styles.info)

    // Extra easter egg message
    console.log(
      '%c💡 Tip:',
      'color: #f59e0b; font-weight: bold;',
      'Check out our watchlist feature to track your favorite shows!'
    )
  }
})
