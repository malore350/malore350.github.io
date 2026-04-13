function ResumeSection() {
  const experiences = [
    {
      date: '2023 — Present',
      title: 'Senior Software Engineer',
      company: 'Unigo',
      location: 'Remote (Baku, Azerbaijan)',
    },
    {
      date: '2021 — 2023',
      title: 'Software Engineer',
      company: 'Unigo',
      location: 'Remote (Baku, Azerbaijan)',
    },
  ];

  const education = [
    {
      date: '2019 — 2025',
      title: 'BSc in CS & Aerospace Engineering',
      company: 'KAIST',
      location: 'Daejeon, South Korea',
    },
  ];

  return (
    <div className="section-content resume-section">
      <div className="resume-container">
        <header className="resume-header">
          <h2 className="resume-title">Resume</h2>
          <p className="resume-about">
            Computer Science and Aerospace Engineering graduate from <strong>KAIST</strong>. 
            I bridge the gap between complex engineering and elegant web experiences, 
            building AI-integrated solutions for real-world impact.
          </p>
        </header>

        <div className="resume-grid">
          <section className="resume-block">
            <h3 className="resume-section-title">Experience</h3>
            <div className="resume-list">
              {experiences.map((exp, i) => (
                <div key={i} className="resume-entry">
                  <div className="resume-entry-header">
                    <span className="resume-entry-date">{exp.date}</span>
                    <h4 className="resume-entry-title">{exp.title}</h4>
                  </div>
                  <div className="resume-entry-subheader">
                    <span className="resume-entry-company">{exp.company}</span>
                    <span className="resume-entry-location">{exp.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="resume-block">
            <h3 className="resume-section-title">Education</h3>
            <div className="resume-list">
              {education.map((edu, i) => (
                <div key={i} className="resume-entry">
                  <div className="resume-entry-header">
                    <span className="resume-entry-date">{edu.date}</span>
                    <h4 className="resume-entry-title">{edu.title}</h4>
                  </div>
                  <div className="resume-entry-subheader">
                    <span className="resume-entry-company">{edu.company}</span>
                    <span className="resume-entry-location">{edu.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ResumeSection;
