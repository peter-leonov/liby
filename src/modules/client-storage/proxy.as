package {

import flash.display.Sprite;
import flash.external.ExternalInterface;

public class proxy extends Sprite {
	public function proxy () {
		ExternalInterface.call('document.getElementById("' + this.loaderInfo.parameters.id + '").onready')
	}
}

}