import React, { useContext } from "react";
import { QuizBattleContext } from "../contexts/CreateQuizBattleContext";

const CreateBattleOptions = () => {
    const { state, dispatch } = useContext(QuizBattleContext);

    const handleOptionsChange = (option, newValue) => {
        dispatch({ type: "UPDATE_BATTLE_OPTION", option, payload: newValue });
    };

    const handleGeneralShopOptionsChange = (option, newValue) => {
        dispatch({ type: "UPDATE_GENERAL_SHOP_OPTION", option, payload: newValue });
    };

    const handleEndGameShopOptionsChange = (option, newValue) => {
        dispatch({ type: "UPDATE_ENDGAME_SHOP_OPTION", option, payload: newValue });
    };

    const handleDeepShopOptions = (shop, nested, option, newValue) => {
        dispatch({ type: "UPDATE_DEEP_SHOP_OPTIONS", shop, nested, option, payload: newValue});
    };

    const handleShopUpgradeRarityOptions = (shop, rarity, newValue) => {
        dispatch({ type: "UPDATE_SHOP_UPGRADE_RARITY_COSTS", shop, rarity, payload: newValue});
    };

    const rarityChecker = (shop) => {
        return (parseInt(state.options.battle[shop].rarities.common) +
        parseInt(state.options.battle[shop].rarities.uncommon) +
        parseInt(state.options.battle[shop].rarities.rare) +
        parseInt(state.options.battle[shop].rarities.epic) +
        parseInt(state.options.battle[shop].rarities.legendary) === 100)
    }

    return (
        <div className="flex flex-wrap gap-8 justify-center flex-row">
            <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-full">
                <div className="card-body justify-center w-full">
                    <h2 className="card-title self-center pb-4">{state.options.battle.enabled ? "Battles are enabled!" : "Battles are disabled!"}</h2>
                    <input type="checkbox" className="checkbox checkbox-primary self-center" checked={state.options.battle.enabled} onChange={(event) => handleOptionsChange("enabled", event.target.checked)}/>
                </div>
            </div>
            {state.options.battle.enabled && (
                <div className="flex flex-wrap gap-8 w-full justify-center flex-row">
                    <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-80">
                        <div className="card-body justify-center w-full">
                            <h2 className="card-title self-center pb-4">General-Shop</h2>
                            <input type="checkbox" className="toggle toggle-success self-center" checked={state.options.battle.betweenShop.enabled} onChange={(event) => handleGeneralShopOptionsChange("enabled", event.target.checked)}/>
                            <div>
                                <div className={`divider ${state.options.battle.betweenShop.enabled && state.options.battle.betweenShop.reroll.enabled ? "divider-success" : "divider-error"}`}>Rerolls</div>
                                <label className="label cursor-pointer mb-2">
                                    <span className="label-text">{state.options.battle.betweenShop.reroll.enabled ? "Enabled" : "Disabled"}</span>
                                    <input type="checkbox" disabled={!state.options.battle.betweenShop.enabled} className="toggle toggle-success self-center" checked={state.options.battle.betweenShop.reroll.enabled} onChange={(event) => handleDeepShopOptions("betweenShop", "reroll", "enabled", event.target.checked)}/>
                                </label>
                                <fieldset disabled={!state.options.battle.betweenShop.enabled || !state.options.battle.betweenShop.reroll.enabled}>
                                    <label className="label cursor-pointer  mb-2">
                                        <span className="label-text">Global counted</span>
                                        <input type="checkbox" className="checkbox checkbox-primary self-center" checked={state.options.battle.betweenShop.reroll.global} onChange={(event) => handleDeepShopOptions("betweenShop", "reroll", "global", event.target.checked)}/>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                                        <span className="label-text font-bold">Count of rerolls: </span>
                                        <input type="number" className="grow spinner text-end" min="1" value={state.options.battle.betweenShop.reroll.count} onChange={(event) => handleDeepShopOptions("betweenShop", "reroll", "count", event.target.value)}/>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                                        <span className="label-text font-bold">Reroll costs: </span>
                                        <input type="number" className="grow no-spinner text-end" min="0" step={10} value={state.options.battle.betweenShop.reroll.costs} onChange={(event) => handleDeepShopOptions("betweenShop", "reroll", "costs", event.target.value)}/>
                                        <span>$</span>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                                        <span className="label-text font-bold">Reroll cost increase: </span>
                                        <input type="number" className="grow no-spinner text-end" min="0" step={10} value={state.options.battle.betweenShop.reroll.costIncrease} onChange={(event) => handleDeepShopOptions("betweenShop", "reroll", "costIncrease", event.target.value)}/>
                                        <span>$</span>
                                    </label>
                                </fieldset>
                            </div>
                            <div>
                                <div className={`divider ${state.options.battle.betweenShop.enabled && state.options.battle.betweenShop.upgrade.enabled ? "divider-success" : "divider-error"}`}>Upgrade</div>
                                <label className="label cursor-pointer mb-2">
                                    <span className="label-text">{state.options.battle.betweenShop.upgrade.enabled ? "Enabled" : "Disabled"}</span>
                                    <input type="checkbox" disabled={!state.options.battle.betweenShop.enabled} className="toggle toggle-success self-center" checked={state.options.battle.betweenShop.upgrade.enabled} onChange={(event) => handleDeepShopOptions("betweenShop", "upgrade", "enabled", event.target.checked)}/>
                                </label>
                                <fieldset disabled={!state.options.battle.betweenShop.enabled || !state.options.battle.betweenShop.upgrade.enabled}>
                                    <label className="label cursor-pointer  mb-2">
                                        <span className="label-text">Global counted</span>
                                        <input type="checkbox" className="checkbox checkbox-primary self-center" checked={state.options.battle.betweenShop.upgrade.global} onChange={(event) => handleDeepShopOptions("betweenShop", "upgrade", "global", event.target.checked)}/>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                                        <span className="label-text font-bold">Count of upgrades: </span>
                                        <input type="number" className="grow spinner text-end" min="1" value={state.options.battle.betweenShop.upgrade.count} onChange={(event) => handleDeepShopOptions("betweenShop", "upgrade", "count", event.target.value)}/>
                                    </label>
                                    <label className="label cursor-pointer mb-2 input-primary">
                                        <span className="label-text">Dynamic upgrade costs</span>
                                        <input type="checkbox" className="checkbox checkbox-primary self-center" checked={state.options.battle.betweenShop.upgrade.dynamicCosts} onChange={(event) => handleDeepShopOptions("betweenShop", "upgrade", "dynamicCosts", event.target.checked)}/>
                                    </label>
                                    <label disabled={state.options.battle.betweenShop.upgrade.dynamicCosts} className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                                        <span className="label-text font-bold">Upgrade costs: </span>
                                        <input disabled={state.options.battle.betweenShop.upgrade.dynamicCosts} type="number" className="grow no-spinner text-end" min="0" step={10} value={state.options.battle.betweenShop.upgrade.costs} onChange={(event) => handleDeepShopOptions("betweenShop", "upgrade", "costs", event.target.value)}/>
                                        <span>$</span>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-primary" disabled={state.options.battle.betweenShop.upgrade.dynamicCosts}>
                                        <span className="label-text font-bold">Upgrade cost increase: </span>
                                        <input type="number" className="grow no-spinner text-end" min="0" step={10} value={state.options.battle.betweenShop.upgrade.costIncrease} onChange={(event) => handleDeepShopOptions("betweenShop", "upgrade", "costIncrease", event.target.value)}/>
                                        <span>$</span>
                                    </label>
                                    <fieldset disabled={!state.options.battle.betweenShop.upgrade.dynamicCosts}>
                                        <label className="input input-bordered flex items-center gap-4 mb-2">
                                            <span className="label-text font-bold">Upgrade "common" costs: </span>
                                            <input type="number" className="grow no-spinner text-end" min="0" step={5} value={state.options.battle.betweenShop.upgrade.costPerRarity.common} onChange={(event) => handleShopUpgradeRarityOptions("betweenShop", "common", event.target.value)}/>
                                            <span>$</span>
                                        </label>
                                        <label className="input input-bordered input-success flex items-center gap-4 mb-2">
                                            <span className="label-text font-bold">Upgrade "uncommon" costs: </span>
                                            <input type="number" className="grow no-spinner text-end" min="0" step={5} value={state.options.battle.betweenShop.upgrade.costPerRarity.uncommon} onChange={(event) => handleShopUpgradeRarityOptions("betweenShop", "uncommon", event.target.value)}/>
                                            <span>$</span>
                                        </label>
                                        <label className="input input-bordered flex items-center gap-4 mb-2 input-info">
                                            <span className="label-text font-bold">Upgrade "rare" costs: </span>
                                            <input type="number" className="grow no-spinner text-end" min="0" step={5} value={state.options.battle.betweenShop.upgrade.costPerRarity.rare} onChange={(event) => handleShopUpgradeRarityOptions("betweenShop", "rare", event.target.value)}/>
                                            <span>$</span>
                                        </label>
                                        <label className="input input-bordered flex items-center gap-4 mb-2 input-secondary">
                                            <span className="label-text font-bold">Upgrade "epic" costs: </span>
                                            <input type="number" className="grow no-spinner text-end" min="0" step={5} value={state.options.battle.betweenShop.upgrade.costPerRarity.epic} onChange={(event) => handleShopUpgradeRarityOptions("betweenShop", "epic", event.target.value)}/>
                                            <span>$</span>
                                        </label>
                                    </fieldset>
                                </fieldset>
                            </div>
                            <div>
                                <div className={`divider ${state.options.battle.betweenShop.enabled && rarityChecker("betweenShop") ? "divider-success" : "divider-error"}`}>Rarity chances</div>
                                <fieldset disabled={!state.options.battle.betweenShop.enabled}>
                                    <label className="input input-bordered flex items-center gap-4 mb-2">
                                        <span className="label-text font-bold">Common</span>
                                        <input type="number" className="grow text-end no-spinner" min="0" step={1} value={state.options.battle.betweenShop.rarities.common} onChange={(event) => handleDeepShopOptions("betweenShop", "rarities", "common", event.target.value)}/>
                                        <span>%</span>
                                    </label>
                                    <label className="input input-bordered input-success flex items-center gap-4 mb-2">
                                        <span className="label-text font-bold">Uncommon</span>
                                        <input type="number" className="grow text-end no-spinner" min="0" step={1} value={state.options.battle.betweenShop.rarities.uncommon} onChange={(event) => handleDeepShopOptions("betweenShop", "rarities", "uncommon", event.target.value)}/>
                                        <span>%</span>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-info">
                                        <span className="label-text font-bold">Rare</span>
                                        <input type="number" className="grow text-end no-spinner" min="0" step={1} value={state.options.battle.betweenShop.rarities.rare} onChange={(event) => handleDeepShopOptions("betweenShop", "rarities", "rare", event.target.value)}/>
                                        <span>%</span>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-secondary">
                                        <span className="label-text font-bold">Epic</span>
                                        <input type="number" className="grow text-end no-spinner" min="0" step={1} value={state.options.battle.betweenShop.rarities.epic} onChange={(event) => handleDeepShopOptions("betweenShop", "rarities", "epic", event.target.value)}/>
                                        <span>%</span>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-warning">
                                        <span className="label-text font-bold">Legendary</span>
                                        <input type="number" className="grow text-end no-spinner" min="0" step={1} value={state.options.battle.betweenShop.rarities.legendary} onChange={(event) => handleDeepShopOptions("betweenShop", "rarities", "legendary", event.target.value)}/>
                                        <span>%</span>
                                    </label>
                                </fieldset>
                            </div>
                            <div>
                                <div className={`divider ${state.options.battle.betweenShop.enabled ? "divider-success" : "divider-error"}`}>General settings</div>
                                <fieldset disabled={!state.options.battle.betweenShop.enabled}>
                                    <div className="tooltip w-full" data-tip="After how many questions a new shop comes.">
                                        <label className="input input-bordered flex items-center gap-4 mb-2">
                                            <span className="label-text font-bold">Shop-interval</span>
                                            <input type="number" className="grow spinner text-end" min="0" step={1} value={state.options.battle.betweenShop.intervalCount} onChange={(event) => handleGeneralShopOptionsChange("intervalCount", event.target.value)}/>
                                        </label>
                                    </div>
                                    <label className="input input-bordered input-success flex items-center gap-4 mb-2">
                                        <span className="label-text font-bold">Item count</span>
                                        <input type="number" className="grow spinner text-end" min="0" step={1} value={state.options.battle.betweenShop.itemCount} onChange={(event) => handleGeneralShopOptionsChange("itemCount", event.target.value)}/>
                                    </label>
                                    <label className="label cursor-pointer mb-2 input-primary">
                                        <span className="label-text font-bold">Guarantee sigil</span>
                                        <input type="checkbox" className="checkbox checkbox-primary self-center" checked={state.options.battle.betweenShop.guaranteedSigil} onChange={(event) => handleGeneralShopOptionsChange("guaranteedSigil", event.target.checked)}/>
                                    </label>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-80">
                        <div className="card-body w-full">
                            <h2 className="card-title self-center pb-4">Endgame-Shop</h2>
                            <input type="checkbox" className="toggle toggle-success self-center" checked={state.options.battle.endShop.enabled} onChange={(event) => handleEndGameShopOptionsChange("enabled", event.target.checked)}/>
                            <div>
                                <div className={`divider ${state.options.battle.endShop.enabled && state.options.battle.endShop.reroll.enabled ? "divider-success" : "divider-error"}`}>Rerolls</div>
                                <label className="label cursor-pointer mb-2">
                                    <span className="label-text">{state.options.battle.endShop.reroll.enabled ? "Enabled" : "Disabled"}</span>
                                    <input type="checkbox" disabled={!state.options.battle.endShop.enabled} className="toggle toggle-success self-center" checked={state.options.battle.endShop.reroll.enabled} onChange={(event) => handleDeepShopOptions("endShop", "reroll", "enabled", event.target.checked)}/>
                                </label>
                                <fieldset disabled={!state.options.battle.endShop.enabled || !state.options.battle.endShop.reroll.enabled}>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                                        <span className="label-text font-bold">Count of rerolls: </span>
                                        <input type="number" className="grow spinner text-end" min="1" value={state.options.battle.endShop.reroll.count} onChange={(event) => handleDeepShopOptions("endShop", "reroll", "count", event.target.value)}/>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                                        <span className="label-text font-bold">Reroll costs: </span>
                                        <input type="number" className="grow no-spinner text-end" min="0" step={10} value={state.options.battle.endShop.reroll.costs} onChange={(event) => handleDeepShopOptions("endShop", "reroll", "costs", event.target.value)}/>
                                        <span>$</span>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                                        <span className="label-text font-bold">Reroll cost increase: </span>
                                        <input type="number" className="grow no-spinner text-end" min="0" step={10} value={state.options.battle.endShop.reroll.costIncrease} onChange={(event) => handleDeepShopOptions("endShop", "reroll", "costIncrease", event.target.value)}/>
                                        <span>$</span>
                                    </label>
                                </fieldset>
                            </div>
                            <div>
                                <div className={`divider ${state.options.battle.endShop.enabled && state.options.battle.endShop.upgrade.enabled ? "divider-success" : "divider-error"}`}>Upgrade</div>
                                <label className="label cursor-pointer mb-2">
                                    <span className="label-text">{state.options.battle.endShop.upgrade.enabled ? "Enabled" : "Disabled"}</span>
                                    <input type="checkbox" disabled={!state.options.battle.endShop.enabled} className="toggle toggle-success self-center" checked={state.options.battle.endShop.upgrade.enabled} onChange={(event) => handleDeepShopOptions("endShop", "upgrade", "enabled", event.target.checked)}/>
                                </label>
                                <fieldset disabled={!state.options.battle.endShop.enabled || !state.options.battle.endShop.upgrade.enabled}>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                                        <span className="label-text font-bold">Count of upgrades: </span>
                                        <input type="number" className="grow spinner text-end" min="1" value={state.options.battle.endShop.upgrade.count} onChange={(event) => handleDeepShopOptions("endShop", "upgrade", "count", event.target.value)}/>
                                    </label>
                                    <label className="label cursor-pointer mb-2 input-primary">
                                        <span className="label-text">Dynamic upgrade costs</span>
                                        <input type="checkbox" className="checkbox checkbox-primary self-center" checked={state.options.battle.endShop.upgrade.dynamicCosts} onChange={(event) => handleDeepShopOptions("endShop", "upgrade", "dynamicCosts", event.target.checked)}/>
                                    </label>
                                    <label disabled={state.options.battle.endShop.upgrade.dynamicCosts} className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                                        <span className="label-text font-bold">Upgrade costs: </span>
                                        <input disabled={state.options.battle.endShop.upgrade.dynamicCosts} type="number" className="grow no-spinner text-end" min="0" step={10} value={state.options.battle.endShop.upgrade.costs} onChange={(event) => handleDeepShopOptions("endShop", "upgrade", "costs", event.target.value)}/>
                                        <span>$</span>
                                    </label>
                                    <label disabled={state.options.battle.endShop.upgrade.dynamicCosts} className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                                        <span className="label-text font-bold">Upgrade cost increase: </span>
                                        <input type="number" className="grow no-spinner text-end" min="0" step={10} value={state.options.battle.endShop.upgrade.costIncrease} onChange={(event) => handleDeepShopOptions("endShop", "upgrade", "costIncrease", event.target.value)}/>
                                        <span>$</span>
                                    </label>
                                    <fieldset disabled={!state.options.battle.endShop.upgrade.dynamicCosts}>
                                        <label className="input input-bordered flex items-center gap-4 mb-2">
                                            <span className="label-text font-bold">Upgrade "common" costs: </span>
                                            <input type="number" className="grow no-spinner text-end" min="0" step={5} value={state.options.battle.endShop.upgrade.costPerRarity.common} onChange={(event) => handleShopUpgradeRarityOptions("endShop", "common", event.target.value)}/>
                                            <span>$</span>
                                        </label>
                                        <label className="input input-bordered input-success flex items-center gap-4 mb-2">
                                            <span className="label-text font-bold">Upgrade "uncommon" costs: </span>
                                            <input type="number" className="grow no-spinner text-end" min="0" step={5} value={state.options.battle.endShop.upgrade.costPerRarity.uncommon} onChange={(event) => handleShopUpgradeRarityOptions("endShop", "uncommon", event.target.value)}/>
                                            <span>$</span>
                                        </label>
                                        <label className="input input-bordered flex items-center gap-4 mb-2 input-info">
                                            <span className="label-text font-bold">Upgrade "rare" costs: </span>
                                            <input type="number" className="grow no-spinner text-end" min="0" step={5} value={state.options.battle.endShop.upgrade.costPerRarity.rare} onChange={(event) => handleShopUpgradeRarityOptions("endShop", "rare", event.target.value)}/>
                                            <span>$</span>
                                        </label>
                                        <label className="input input-bordered flex items-center gap-4 mb-2 input-secondary">
                                            <span className="label-text font-bold">Upgrade "epic" costs: </span>
                                            <input type="number" className="grow no-spinner text-end" min="0" step={5} value={state.options.battle.endShop.upgrade.costPerRarity.epic} onChange={(event) => handleShopUpgradeRarityOptions("endShop", "epic", event.target.value)}/>
                                            <span>$</span>
                                        </label>

                                    </fieldset>
                                </fieldset>
                            </div>
                            <div>
                                <div className={`divider ${state.options.battle.endShop.enabled && rarityChecker("endShop") ? "divider-success" : "divider-error"}`}>Rarity chances</div>
                                <fieldset disabled={!state.options.battle.endShop.enabled}>
                                    <label className="input input-bordered flex items-center gap-4 mb-2">
                                        <span className="label-text font-bold">Common</span>
                                        <input type="number" className="grow text-end no-spinner" min="0" step={1} value={state.options.battle.endShop.rarities.common} onChange={(event) => handleDeepShopOptions("endShop", "rarities", "common", event.target.value)}/>
                                        <span>%</span>
                                    </label>
                                    <label className="input input-bordered input-success flex items-center gap-4 mb-2">
                                        <span className="label-text font-bold">Uncommon</span>
                                        <input type="number" className="grow text-end no-spinner" min="0" step={1} value={state.options.battle.endShop.rarities.uncommon} onChange={(event) => handleDeepShopOptions("endShop", "rarities", "uncommon", event.target.value)}/>
                                        <span>%</span>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-info">
                                        <span className="label-text font-bold">Rare</span>
                                        <input type="number" className="grow text-end no-spinner" min="0" step={1} value={state.options.battle.endShop.rarities.rare} onChange={(event) => handleDeepShopOptions("endShop", "rarities", "rare", event.target.value)}/>
                                        <span>%</span>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-secondary">
                                        <span className="label-text font-bold">Epic</span>
                                        <input type="number" className="grow text-end no-spinner" min="0" step={1} value={state.options.battle.endShop.rarities.epic} onChange={(event) => handleDeepShopOptions("endShop", "rarities", "epic", event.target.value)}/>
                                        <span>%</span>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-4 mb-2 input-warning">
                                        <span className="label-text font-bold">Legendary</span>
                                        <input type="number" className="grow text-end no-spinner" min="0" step={1} value={state.options.battle.endShop.rarities.legendary} onChange={(event) => handleDeepShopOptions("endShop", "rarities", "legendary", event.target.value)}/>
                                        <span>%</span>
                                    </label>
                                </fieldset>
                            </div>
                            <div>
                                <div className={`divider ${state.options.battle.endShop.enabled ? "divider-success" : "divider-error"}`}>General settings</div>
                                <fieldset disabled={!state.options.battle.endShop.enabled}>
                                    <label className="input input-bordered input-success flex items-center gap-4 mb-2">
                                        <span className="label-text font-bold">Item count</span>
                                        <input type="number" className="grow spinner text-end" min="0" step={1} value={state.options.battle.endShop.itemCount} onChange={(event) => handleEndGameShopOptionsChange("itemCount", event.target.value)}/>
                                    </label>
                                    <label className="label cursor-pointer mb-2 input-primary">
                                        <span className="label-text font-bold">Guarantee sigil</span>
                                        <input type="checkbox" className="checkbox checkbox-primary self-center" checked={state.options.battle.endShop.guaranteedSigil} onChange={(event) => handleEndGameShopOptionsChange("guaranteedSigil", event.target.checked)}/>
                                    </label>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>)}
        </div>
    )
};

export default CreateBattleOptions