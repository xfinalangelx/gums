import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import CustomSlider from "../components/Slider/Slider";

const Gallery = () => {
  const [images, setImages] = useState([]);

  async function fetchAllImages() {
    const images_holder = [];
    const { data } = await supabase.from("ads").select("*");
    data.forEach((x) => {
      var ele = {
        imgURL:
          "https://hvzzpfhyghxvhtfvtivo.supabase.co/storage/v1/object/public/ads/" +
          x.id,
        imgAlt: x.id,
      };
      images_holder.push(ele);
      setImages(images_holder);
    });
    console.log(images);
  }

  useEffect(() => {
    const fetchData = async () => {
      fetchAllImages();
    };

    fetchData();
  }, []);

  return (
    <div>
      {" "}
      <div className="w-full bg-green-800 text-white py-5 px-4 flex justify-between items-center">
        <a
          href="/"
          className="font-semibold text-white text-lg flex items-center gap-2"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              height="800"
              width="800"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 511.999 511.999"
            >
              <path
                fill="#6cd800"
                d="m420.364 255.999-185.261-20.898L256 420.364c9.672 24.942 23.54 48.725 43.281 68.465 30.894 30.894 80.984 30.894 111.878 0 15.089-15.089 22.788-34.758 23.137-54.532 19.775-.35 39.443-8.048 54.532-23.137 30.895-30.894 30.895-80.984 0-111.878-19.74-19.742-43.523-33.611-68.464-43.283"
              />
              <path
                fill="#53b400"
                d="M420.364 255.999c24.942-9.672 48.725-23.54 68.465-43.281 30.895-30.895 30.895-80.984 0-111.878-15.089-15.089-34.757-22.788-54.532-23.137-.35-19.775-8.048-39.443-23.137-54.532-30.894-30.894-80.984-30.894-111.878 0-19.74 19.74-33.609 43.523-43.281 68.465l-20.898 164.363z"
              />
              <path
                fill="#93f340"
                d="M91.637 255.999c-24.942 9.672-48.725 23.54-68.466 43.281-30.894 30.895-30.894 80.984 0 111.878 15.089 15.089 34.757 22.788 54.532 23.137.35 19.775 8.048 39.443 23.137 54.532 30.895 30.895 80.984 30.895 111.878 0 19.741-19.741 33.609-43.524 43.281-68.465V235.101z"
              />
              <path
                fill="#6cd800"
                d="M256 91.636c-9.672-24.942-23.54-48.725-43.281-68.465-30.895-30.894-80.984-30.894-111.878 0-15.089 15.088-22.788 34.757-23.138 54.531-19.775.35-39.443 8.048-54.532 23.137-30.894 30.894-30.894 80.984 0 111.878 19.741 19.741 43.524 33.61 68.466 43.282H256z"
              />
              <path
                fill="#93f340"
                d="m381.705 152.46-22.166-22.165L256 233.834l-10.449 22.165L256 278.165l103.539 103.539 22.166-22.166-103.539-103.539z"
              />
              <path
                fill="#cfffa5"
                d="m152.461 130.295-22.165 22.165 103.539 103.539-103.539 103.539 22.165 22.166L256 278.165v-44.331z"
              />
            </svg>
          </div>
          PPPSUM
        </a>
        <div className="flex items-center gap-4 font-semibold">
          <a href="/feedbackform" className="hover:text-green-400">
            Feedback
          </a>
          <a href="/" className="hover:text-green-400">
            Sponsor Us
          </a>
          <a href="/gallery" className="hover:text-green-400">
            Gallery
          </a>
          <a href="/about" className="hover:text-green-400">
            About Us
          </a>
        </div>
      </div>
      <div className="w-full h-full">
        <CustomSlider>
          {images.map((image, index) => {
            return <img key={index} src={image.imgURL} alt={image.imgAlt} />;
          })}
        </CustomSlider>
      </div>
    </div>
  );
};

export default Gallery;
