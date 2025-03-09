const Footer = () => {
  return (
    <div className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="flex flex-col sm:flex-row justify-center items-center">
          <span>{new Date().getFullYear()} Шері ФМ Україна.</span>
          <span className="sm:ml-1">Із самого серця Бучі</span>
        </p>
      </div>
    </div>
  )
}

export default Footer

