function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>Northstar</h1>
        <span>Command Center</span>
      </div>

      <nav>
        <a>⌂ Dashboard</a>
        <a>🎯 Missions</a>
        <a>📁 Projects</a>
        <a>📚 Knowledge</a>
        <a>🧰 Assets</a>

        <div className="divider" />

        <a className="disabled">
          🧠 AI
          <small>Coming Soon</small>
        </a>

        <a>⚙ Settings</a>
      </nav>
    </aside>
  )
}

export default Sidebar