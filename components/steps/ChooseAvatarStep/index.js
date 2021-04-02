import React from 'react'
import clsx from 'clsx'
import { WhiteBlock } from '../../WhiteBlock'
import { Button } from '../../Button'
import { StepInfo } from '../../StepInfo'
import { Avatar } from '../../Avatar'

import styles from './ChooseAvatarStep.module.scss'

export const ChooseAvatarStep = () => {
  const [avatarUrl, setAvatarUrl] = React.useState(
    'https://i.pinimg.com/originals/33/db/51/33db51b709c04b279a1826b3bbf0faf2.png'
  )
  const inputFileRef = React.useRef(null)

  const handleChangeImage = (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)

      setAvatarUrl(imageUrl)
    }
  }

  React.useEffect(() => {
    if (inputFileRef.current) {
      const ref = inputFileRef.current
      ref.addEventListener('change', handleChangeImage)
      return () => ref.removeEventListener('change', handleChangeImage)
    }
  }, [])

  return (
    <div className={styles.block}>
      <StepInfo icon="/static/celebration.png" title="Okay, Artem Averyanov!" description="How’s this photo?" />
      <WhiteBlock className={clsx('m-auto mt-40', styles.whiteBlock)}>
        <div className={styles.avatar}>
          <Avatar width="120px" height="120px" src={avatarUrl} />
        </div>
        <div className="mb-30">
          <label htmlFor="image" className="link cup">
            Choose a different photo
          </label>
        </div>
        <input id="image" ref={inputFileRef} type="file" hidden />
        <Button onClick={() => {}}>
          Next
          <img className="d-ib ml-10" src="/static/arrow.svg" />
        </Button>
      </WhiteBlock>
    </div>
  )
}
