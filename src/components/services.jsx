const serviceHighlights = [
  {
    title: 'Tournament hosting',
    description:
      'Age-group competitions planned with schedules, venue flow, and a professional event structure.',
  },
  {
    title: 'Player exposure',
    description:
      'We create opportunities for players to perform in front of coaches, mentors, and wider sports communities.',
  },
  {
    title: 'Team culture',
    description:
      'Every tournament is designed to build confidence, match awareness, resilience, and team discipline.',
  },
]

function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="services-heading">
        <p className="eyebrow services-eyebrow">Our Mission</p>
        <h2 className="services-title">
          You don't have to
          <br />
          do it alone
        </h2>
        <p className="services-intro">
          Turfingo is not just tournaments. It is a path to play, grow, and
          compete together with players, coaches, and academies around you.
        </p>
      </div>
      <div className="service-grid">
        {serviceHighlights.map((item, index) => (
          <article className="service-card" key={item.title}>
            <span className="service-index">0{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
