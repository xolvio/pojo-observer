import {File} from './File'
import {IFileRepository} from './IFileRepository'

const lorem0 =
  'Shankle meatloaf spare ribs doner bacon jerky sirloin corned beef pork chop porchetta beef ribs leberkas pork loin drumstick turducken. Short ribs meatball hamburger swine, rump kevin landjaeger shankle pork belly tongue cupim chuck pork. Drumstick ground round prosciutto spare ribs burgdoggen, ham brisket chislic frankfurter short loin shank pork filet mignon turkey. Doner beef ribs jowl, rump fatback capicola andouille brisket short ribs t-bone filet mignon cupim tongue. Pig beef pork loin alcatra fatback corned beef salami.'
const lorem1 =
  'Bacon ipsum dolor amet ham hock boudin short loin alcatra andouille. Ground round ribeye frankfurter tail, biltong cupim shank burgdoggen. Shoulder corned beef bresaola capicola leberkas. Short ribs ribeye cow, kielbasa beef ribs pork belly chuck. Landjaeger prosciutto tri-tip pork chop porchetta jerky brisket tenderloin ball tip swine.'
const lorem2 =
  'Buffalo biltong pork loin tail swine. Meatball chicken fatback chuck, tail venison picanha chislic hamburger spare ribs turducken filet mignon. Ground round jowl shank chislic. Alcatra chislic chuck swine prosciutto shankle frankfurter meatball ground round tri-tip ball tip jerky hamburger.'
const lorem3 =
  'Cow pork chop brisket pastrami tri-tip ham kielbasa. T-bone ham cow picanha biltong ground round sausage boudin. Venison rump porchetta chislic shankle salami chuck drumstick. Hamburger meatloaf meatball bacon, spare ribs leberkas turducken frankfurter ground round sausage pork biltong. Turkey swine tail spare ribs. Bacon meatball flank pig picanha salami'
const lorem4 =
  'Boudin chicken tongue short loin rump flank fatback turducken short ribs picanha venison chuck porchetta. Boudin shankle capicola ham leberkas beef biltong sirloin corned beef frankfurter porchetta jerky. Doner biltong spare ribs, jowl short loin ground round tongue strip steak leberkas kielbasa bacon shank cupim swine. Corned beef chicken swine, tongue venison ground round pork loin turkey salami ball tip pork chop pancetta. Beef doner boudin rump pork belly turducken capicola venison, buffalo short loin shank prosciutto andouille ball tip.'

export class MemoryFileRepository implements IFileRepository {
  files: File[] = []

  _counter = 0

  constructor() {
    this.files.push(new File(`File ${this.getNextFileNumber()}`, '/', lorem0))
    this.files.push(
      new File(`File ${this.getNextFileNumber()}`, '/src/', lorem1)
    )
    this.files.push(
      new File(`File ${this.getNextFileNumber()}`, '/test/', lorem2)
    )
    this.files.push(
      new File(`File ${this.getNextFileNumber()}`, '/lib/', lorem3)
    )
    this.files.push(
      new File(`File ${this.getNextFileNumber()}`, '/dist/', lorem4)
    )
  }

  getNextFileNumber(): number {
    this._counter += 1
    return this._counter
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  async getFiles(): Promise<File[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(this.files)
      }, 1000)
    )
  }

  async writeFiles(): Promise<void> {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(this)
      }, 1000)
    )
  }
}
