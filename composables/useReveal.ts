export function useReveal() {
  onMounted(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.setAttribute('data-visible', '')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' })

    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el))
  })
}
