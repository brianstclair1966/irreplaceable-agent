export default function VideoEmbed({ id, title }) {
  if (!id) return null
  return (
    <div>
      <div className="video-container">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title || 'Training video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="text-xs italic text-brand-taupe text-center mt-2">
        Recorded live at a 6th Ave Homes training class — expect a real, conversational session.
      </p>
    </div>
  )
}
