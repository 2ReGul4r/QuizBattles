import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHandFist, faGaugeHigh, faClover, faShieldHalved, faBullseye, faRunning } from "@fortawesome/free-solid-svg-icons";

const ItemCard = (item) => {
    return (
        <div className="card lg:card-normal bg-base-100 max-w-128 shadow-xl item-card text-black">
            <figure>
                {!item.picture.data
                    ? <div className="skeleton m-4 h-64 w-64"></div>
                    : <img
                            className={`${getRarityCSSClass(item.rarity)} m-4 max-w-64 max-h-64`}
                            alt={getImageAltText(item.name)}
                            src={getImageSrc(item.picture)}
                        />
                }
            </figure>
            <div className="card-body">
                <h2 className="card-title font-vinque font-thin text-3xl">{item.name}</h2>
                <ul>
                    {Object.entries(item.attributes).map(function(object, i) {
                        const [attribute, value] = object;
                        if (value) {
                            return <li key={`attribute_index_${i}`}><p><FontAwesomeIcon icon={attributeIcons[attribute]}/> : {value}</p></li>;
                        }
                    })}
                </ul>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy for {item.cost}</button>
                </div>
            </div>
        </div>
    )
}

function getImageSrc(pictureData) {
    if (!pictureData.data) {
        return ""
    }
    return pictureData.data
}

function getImageAltText(itemName) {
    return `Item_${itemName}_picture`
}

function getRarityCSSClass(rarity) {
    return `rarity-${rarity}`
}

const attributeIcons = {
    health: faHeart,
    damage: faHandFist,
    speed: faGaugeHigh,
    luck: faClover,
    resistance: faShieldHalved,
    accuracy: faBullseye,
    dodging: faRunning
}

export default ItemCard