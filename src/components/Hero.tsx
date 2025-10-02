interface HeroProps {
  image: {
    src: string;
    alt: string;
  };
  children?: React.ReactNode;
}

const Hero = ({
  image = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "default alt text",
  },
}: HeroProps) => {
  return (
    <section className='relative h-[500px] w-full'>
      {/* imagem de fundo */}
      <img
        src={image.src}
        alt={image.alt}
        className='absolute inset-0 w-full h-full object-cover'
      />

      {/* overlay escuro */}
      <div className='absolute inset-0 bg-black/50' />

      {/* conteúdo centralizado */}
      <div className='absolute inset-0  items-center justify-center flex flex-col space-y-2'>
        <h1 className='text-white text-4xl font-bold'>
          Encontre as melhores autopeças
        </h1>
        <h2 className="text-sm text-gray-50">Busque por auto peças, modelos, marcas, aplicações...</h2>
      </div>
    </section>
  );
};

export { Hero };
