import * as React from 'react'
import './timetable.scss'

const Timetable = () => {
  return (
    <div class='timetable'>
      <div class='week-names'>
        <div>Lundi</div>
        <div>Mardi</div>
        <div>Mercredi</div>
        <div>Jeudi</div>
        <div>Vendredi</div>
        <div>Samedi</div>
      </div>
      <div class='time-interval'>
        <div>7:30 - 9:00</div>
        <div>9:00 - 10:30</div>
        <div>10:30 - 12:00</div>
        <div>13:30 - 15:00</div>
        <div>15:00 - 16:30</div>
      </div>
      <div class='content'>
        {/* 7:30 - 9:00 */}
        <div>
          <div class='accent-orange'>
            PROG1 <br /> Architecture logicielle <br /> - <br /> Lou
          </div>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div>
          <div class='accent-green'>
            PROG1 <br /> Architecture logicielle <br /> - <br /> Lou
          </div>
        </div>
        <div></div>
        <div></div>

        {/* 9:00 - 10:30 */}
        <div></div>
        <div></div>
        <div></div>
        <div>
          <div class='accent-cyan'>
            PROG1 <br /> Architecture logicielle <br /> - <br /> Lou
          </div>
        </div>
        <div></div>

        {/* 10:30 - 12:00 */}
        <div>
          <div class='accent-pink'>
            PROG1 <br /> Architecture logicielle <br /> - <br /> Lou
          </div>
        </div>
        <div></div>
        <div>
          <div class='accent-purple'>
            PROG1 <br /> Architecture logicielle <br /> - <br /> Lou
          </div>
        </div>
        <div></div>
        <div></div>
        <div></div>

        {/* 13:30 - 15:00 */}
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>

        {/* 15:00 - 16:30 */}
        <div>
          <div class='accent-purple'>
            PROG1 <br /> Architecture logicielle <br /> - <br /> Lou
          </div>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Timetable
