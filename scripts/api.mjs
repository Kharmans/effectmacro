import {MODULE} from "./constants.mjs";
import {EM} from "./main.mjs";

export class AppendedActiveEffectMethods {
  /**
   * Call a specific type of script in an effect.
   * @param {string} type         The trigger of the script (default "never").
   * @param {object} context      Additional arguments to pass to the macro.
   */
  static callMacro = async function(type = "never", context = {}) {
    const script = this.getFlag(MODULE, `${type}.script`);
    if (!script) return ui.notifications.warn("EFFECTMACRO.NoSuchScript", {localize: true});
    return EM.executeScripts(this, script, context);
  }

  /**
   * Return whether an effect has a script of this type.
   * @param {string} type     The trigger to check for.
   * @returns {boolean}       Whether the effect has a script of this type.
   */
  static hasMacro = function(type = "never") {
    return !!this.getFlag(MODULE, `${type}.script`);
  }

  /**
   * Remove a specific triggered script from this effect.
   * @param {string} type         The script to remove.
   * @returns {ActiveEffect}      The effect after being updated.
   */
  static removeMacro = async function(type = "never") {
    const script = this.getFlag(MODULE, type);
    if (!script) return null;
    return this.unsetFlag(MODULE, type);
  }

  /**
   * Create a script on the effect.
   * @param {string} type         The type of script to embed.
   * @param {string} script       The macro command to embed.
   * @returns {ActiveEffect}      The effect after being updated.
   */
  static createMacro = async function(type = "never", script) {
    if (!script) {
      return ui.notifications.warn("EFFECTMACRO.NoScriptProvided", {localize: true});
    } else if (script instanceof Function) {
      return this.setFlag(MODULE, `${type}.script`, `(
        ${script.toString()}
      )()`);
    } else {
      return this.setFlag(MODULE, `${type}.script`, script.toString());
    }
  }

  /**
   * Update a script on the effect.
   * @param {string} type         The type of script to update.
   * @param {string} script       The new macro command to embed.
   * @returns {ActiveEffect}      The effect after being updated.
   */
  static updateMacro = async function(type = "never", script) {
    if (!script) return this.removeMacro(type);
    else if (script.toString() !== this.getFlag(MODULE, `${type}.script`)) {
      return this.createMacro(type, script);
    }
  }

  /**
   * Append the new ActiveEffect methods to the prototype.
   */
  static _appendMethods() {
    ActiveEffect.prototype.callMacro = AppendedActiveEffectMethods.callMacro;
    ActiveEffect.prototype.removeMacro = AppendedActiveEffectMethods.removeMacro;
    ActiveEffect.prototype.createMacro = AppendedActiveEffectMethods.createMacro;
    ActiveEffect.prototype.updateMacro = AppendedActiveEffectMethods.updateMacro;
    ActiveEffect.prototype.hasMacro = AppendedActiveEffectMethods.hasMacro;
  }
}
