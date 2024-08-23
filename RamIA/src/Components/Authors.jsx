import '../styles/Authors.css';

export default function Authors() {
  const authors = [
    {
      name: "Alexander Bodner",
      role: "Developer",
      social: {
        twitter: "https://x.com/AlexBodner_",
        github: "https://github.com/AlexBodner",
        linkedin: "https://www.linkedin.com/in/alexanderbodner/"
      }
    },
    {
      name: "Tomás Podolsky",
      role: "Developer",
      social: {
        twitter: "https://twitter.com/author2",
        github: "https://github.com/author2",
        linkedin: "https://linkedin.com/in/author2"
      }
    }
  ];

  return (
    <section className="authors">
      <h2>Meet the Authors</h2>
      <div className="authorGrid">
        {authors.map((author, index) => (
          <div key={index} className="authorCard">
            <h3>{author.name}</h3>
            <p>{author.role}</p>
            <div className="socialLinks">
              <a href={author.social.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href={author.social.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}