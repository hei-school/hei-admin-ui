import * as React from "react"
import './timetable.scss'

const Timetable = () => {
    return <div class="timetable">
        <div class="week-names">
            <div>Monday</div>
            <div>Tuesday</div>
            <div>Wednesday</div>
            <div>Thursday</div>
            <div>Friday</div>
        </div>
        <div class="time-interval">
            <div>7:30 - 9:00</div>
            <div>9:00 - 10:30</div>
            <div>10:30 - 12:00</div>
            <div>13:30 - 15:00</div>
            <div>15:00 - 16:30</div>
        </div>
        <div class="content">
            {/* 7:30 - 9:00 */}
            <div>
                <div class="accent-orange-gradient">
                    PROG1 <br /> Architecture logicielle <br /> - <br /> Lou
                </div>
            </div>
            <div>
            </div>
            <div></div>
            <div></div>
            <div>
                <div class="accent-green-gradient">
                    PROG1 <br /> Architecture logicielle <br /> - <br /> Lou
                </div>
            </div>

            {/* 9:00 - 10:30 */}
            <div></div>
            <div></div>
            <div></div>
            <div>
                <div class="accent-cyan-gradient"></div>
            </div>
            <div></div>

            {/* 10:30 - 12:00 */}
            <div>
                <div class="accent-pink-gradient"></div>
            </div>
            <div></div>
            <div>
                <div class="accent-purple-gradient"></div>
            </div>
            <div></div>
            <div></div>

            {/* 13:30 - 15:00 */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>

            {/* 15:00 - 16:30 */}
            <div>
                <div class="accent-purple-gradient"></div>
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
};

export default Timetable;