import { library } from "@fortawesome/fontawesome-svg-core";
import { faHourglassStart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faClock, faFileVideo } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faHourglassStart, faClock, faFileVideo, faTrash);

export { FontAwesomeIcon };
