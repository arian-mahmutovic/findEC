import './LandingPage.css'
import CompetitionCard from './CompetitionCards';
import Feature from './Feature';
import SignUpForm from './SignUpForm';
import SearchBar from './SearchBar';
import { useState } from 'react';

export default function HomePage() {
  const [showSignup, setShowSignup] = useState(false);

  const openSignPopup = () => {!showSignup && setShowSignup(true);};
  const closeSignPopup = () => {showSignup && setShowSignup(false)};

  return (
    <main>

      {/* Navigation */}

      <nav>
        <h1>Epictetus Project</h1>

        <div>
          <a href="/competitions">Competitions</a>
          <a href="#">Guides</a>
          <a href="#">Newsletter</a>
          <a href="#">About</a>
        </div>

        <button onClick={openSignPopup}>Sign In</button>
      </nav>

      {/* Signup Popup */}

      {showSignup && <SignUpForm closeForm={closeSignPopup} />}

      {/* Hero */}

      <section className="hero">

        <span className="hero-tag">
          Your Competition Guidance Platform
        </span>

        <h1>
          Discover opportunities.
          <br />
          Learn how to win them.
        </h1>

        <p>
          Search for the best academic competitions, scholarships,
          research programs, and summer opportunities—with guides,
          timelines, and winning strategies built specifically
          to help you excel in them.
        </p>

        <SearchBar openSignPopup={openSignPopup} />

        <div className="categories">
          {[
            "Business",
            "STEM",
            "Research",
            "Finance",
            "Writing",
            "Entrepreneurship"
          ].map(tag => (
            <button key={tag}>
              {tag}
            </button>
          ))}
        </div>

      </section>

      {/* Stats */}

      <section className="stats">
        
        <div>
          <h2>High Value</h2>
          <p>Opportunities</p>
        </div>

        <div>
          <h2>In Depth</h2>
          <p>Step-by-Step Guides</p>
        </div>

        <div>
          <h2>All Major</h2>
          <p>Categories</p>
        </div>

        <div>
          <h2>Growing</h2>
          <p>Student Community</p>
        </div>

      </section>

      {/* Features */}

      <section className="features">

        <h2>Everything you need to compete.</h2>

        <div className="feature-grid">

          <Feature
            title="Competition Database"
            desc="Search competitions by subject, grade level, deadlines, prizes, prestige, and eligibility."
          />

          <Feature
            title="Winning Guides"
            desc="Learn what successful competitors actually did, common mistakes, timelines, and preparation resources."
          />

          <Feature
            title="Personal Recommendations"
            desc="Receive opportunities based on your interests, experience, goals, and grade level."
          />

          <Feature
            title="College Value"
            desc="Understand which opportunities carry the most weight for selective admissions."
          />

          <Feature
            title="Resources"
            desc="Books, courses, practice material, previous prompts, and official links—all in one place."
          />

          <Feature
            title="Community"
            desc="Connect with ambitious students looking for teammates, advice, and accountability."
          />

        </div>

      </section>

      {/* Competitions */}

      <section className="competitions">

        <h2>Explore Opportunities</h2>

        <div className="competition-grid">

          <CompetitionCard
            title="Wharton Investment Competition"
            category="Finance"
            difficulty="★★★★★"
          />

          <CompetitionCard
            title="Blue Ocean Competition"
            category="Entrepreneurship"
            difficulty="★★★★☆"
          />

          <CompetitionCard
            title="Harvard Crimson Global Essay"
            category="Writing"
            difficulty="★★★★☆"
          />

        </div>

      </section>

      {/* CTA */}

      <section className="cta">

        <h2>
          Stop searching.
          <br />
          <span className="start-preparing">Start preparing.</span>
        </h2>

        <p>
          Join ambitious students discovering opportunities
          before everyone else.
        </p>

        <button onClick={openSignPopup}>
          Create Free Account
        </button>

      </section>

      {/* Footer */}

      <footer>
        © 2026 Project Epictetus
      </footer>

    </main>
  );
};