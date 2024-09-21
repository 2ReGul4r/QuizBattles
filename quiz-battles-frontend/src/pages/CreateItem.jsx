import { useState } from "react";

const rarityCSSClasses = ["rarity-Common", "rarity-Uncommon", "rarity-Rare", "rarity-Epic", "rarity-Legendary"]

const CreateItem = () => {
  const [base64Image, setBase64Image] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRadioChange = (event) => {
    const rarity = event.target.value;
    document.getElementById("itemPicturePreview").classList.remove(...rarityCSSClasses)
    document.getElementById("itemPicturePreview").classList.add(rarity);
  }

  const handleSubmit = () => {
    // Hier kannst du den Base64-String in deiner Datenbank speichern
    console.log("Bild als Base64 gespeichert:", base64Image);
  };

  return (
    <div className="flex mx-auto min-w-64 w-80 flex-col">
      <h1 className="self-center text-3xl mb-8">Create Item Page</h1>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="file-input file-input-bordered w-full max-w-xs"
      />
      {base64Image && (
        <img id="itemPicturePreview" src={base64Image} alt="Item image preview" className="self-center mt-4 max-w-32 max-h-32 rarity-Common" />
      )}
      <div className="divider divider-primary"/>
      <label className="input input-bordered flex items-center gap-2">
        Itemname: 
        <input type="text" className="grow" />
      </label>
      <div className="divider divider-primary"/>
      <div className="form-control">
        <form name="itemRarityRadio" onChange={handleRadioChange}>
          <label className="label cursor-pointer">
            <span className="label-text pr-2">Common</span>
            <input type="radio" name="itemRarityRadio" className="radio checked:bg-gray-600" disabled={!base64Image} value="rarity-Common" defaultChecked />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text pr-2">Uncommon</span>
            <input type="radio" name="itemRarityRadio" className="radio checked:bg-green-600" disabled={!base64Image} value="rarity-Uncommon"/>
          </label>
          <label className="label cursor-pointer">
            <span className="label-text pr-2">Rare</span>
            <input type="radio" name="itemRarityRadio" className="radio checked:bg-blue-600" disabled={!base64Image} value="rarity-Rare"/>
          </label>
          <label className="label cursor-pointer">
            <span className="label-text pr-2">Epic</span>
            <input type="radio" name="itemRarityRadio" className="radio checked:bg-purple-600" disabled={!base64Image} value="rarity-Epic"/>
          </label>
          <label className="label cursor-pointer">
            <span className="label-text pr-2">Legendary</span>
            <input type="radio" name="itemRarityRadio" className="radio checked:bg-orange-600" disabled={!base64Image} value="rarity-Legendary"/>
          </label>
        </form>
      </div>
      <div className="divider divider-primary"/>
      <button onClick={handleSubmit} className="btn btn-primary mt-4">
        Item Speichern
      </button>
    </div>
  );
}

export default CreateItem;
