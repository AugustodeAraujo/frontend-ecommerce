interface Her1Props {
  image: {
    src: string;
    alt: string;
  };
}

const Hero = ({
  image = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "default alt text",
  },
}: Her1Props) => {
  return (
    <section>
      <img
        src={image.src}
        alt={image.alt}
        className='max-h-96 w-full  object-cover'
      />
    </section>
  );
};

export { Hero };
