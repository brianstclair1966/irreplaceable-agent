export default function VideoEmbed({ id, title }) {
  if (!id) return null
  return (
    <div className="video-container">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title || 'Training video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
