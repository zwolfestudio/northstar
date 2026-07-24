import { NavLink } from "react-router-dom";

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? "active" : undefined;

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>Northstar</h1>
        <span>Command Center</span>
      </div>

      <nav>
        <NavLink to="/" end className={navLinkClassName}>
          ⌂ Dashboard
        </NavLink>
        <NavLink to="/search" className={navLinkClassName}>
          🔍 Search
        </NavLink>
        <NavLink to="/character" className={navLinkClassName}>
          🧑 Character
        </NavLink>
        <NavLink to="/missions" className={navLinkClassName}>
          🎯 Missions
        </NavLink>
        <NavLink to="/projects" className={navLinkClassName}>
          📁 Projects
        </NavLink>
        <NavLink to="/finished" className={navLinkClassName}>
          ✅ Finished
        </NavLink>
        <NavLink to="/knowledge" className={navLinkClassName}>
          📚 Knowledge
        </NavLink>

        <a className="disabled">
          🧰 Assets
          <small>Future</small>
        </a>

        <div className="divider" />

        <a className="disabled">
          🧠 AI
          <small>Coming Soon</small>
        </a>

        <NavLink to="/settings" className={navLinkClassName}>
          ⚙ Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
