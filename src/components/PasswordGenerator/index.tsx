import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { useState, useEffect, useRef } from 'react'
import { AiFillCopy } from 'react-icons/ai'

import passwordGif from '../../assets/gif/password.gif'
import { ReactComponent as Copy } from '../../assets/icons/copy.svg'
import { ReactComponent as Refresh } from '../../assets/icons/refresh.svg'
import Checkbox from '../Checkbox'
import './index.css'

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState<number>(8)
  const [password, setPassword] = useState<string>('')
  const [copyButtonText, setCopyButtonText] = useState('Copy')
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(false)
  const [includeNumber, setIncludeNumber] = useState(true)
  const [includeSpecialChars, setIncludeSpecialChars] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<string>('')

  let passwordStrengthItem = document.getElementById('passwordStrengthItem')

  useEffect(() => {
    generatePassword()
  }, [])

  const generatePassword = (): void => {
    const characters: string[] = []
    if (includeUppercase) {
      characters.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    }
    if (includeLowercase) {
      characters.push(...'abcdefghijklmnopqrstuvwxyz')
    }
    if (includeNumber) {
      characters.push(...'0123456789')
    }
    if (includeSpecialChars) {
      characters.push(...'!@#$%^&*()')
    }

    if (passwordLength < 8) {
      setPasswordStrength('weak')
      passwordStrengthItem?.classList.add('weak')
    }
    const checkPasswordStrength = (password: string) => {
      if (password.length >= 8) {
        const hasUppercase = /[A-Z]/.test(password)
        const hasLowercase = /[a-z]/.test(password)
        const hasNumber = /[0-9]/.test(password)
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

        if (hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
          setPasswordStrength('Hard')
          passwordStrengthItem?.classList.add('strong')
          passwordStrengthItem?.classList.remove('medium')
          passwordStrengthItem?.classList.remove('weak')
        } else if (
          (hasUppercase && hasLowercase && hasNumber) ||
          (hasUppercase && hasLowercase && hasSpecialChar) ||
          (hasUppercase && hasNumber && hasSpecialChar) ||
          (hasLowercase && hasNumber && hasSpecialChar)
        ) {
          setPasswordStrength('Medium')
          passwordStrengthItem?.classList.add('medium')
          passwordStrengthItem?.classList.remove('strong')
          passwordStrengthItem?.classList.remove('weak')
        } else {
          setPasswordStrength('Easy')
          passwordStrengthItem?.classList.remove('weak')
          passwordStrengthItem?.classList.remove('medium')
          passwordStrengthItem?.classList.remove('strong')
        }
      }
    }

    let newPassword = ''
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      newPassword += characters[randomIndex]
    }
    setPassword(newPassword)
    checkPasswordStrength(newPassword)
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        setCopyButtonText('Copied!')
        setTimeout(() => {
          setCopyButtonText('Copy')
        }, 1000)
      })
      .catch((error) => {
        console.error('Failed to copy to clipboard:', error)
      })
  }
  const onChangePasswordLength = (value: number | number[]) => {
    setPasswordLength(value as number)
  }

  return (
    <div className="password-wrapper">
      <div className="tac">
        <h2 className="title">PASSWORD GENERATOR</h2>
      </div>
      <div className="password-input-wrapper">
        <div className="password-field">
          <input type="text" placeholder="your password" value={password} />
          <Refresh onClick={generatePassword} />
        </div>
        <button className="copy-btn" onClick={copyToClipboard}>
          <AiFillCopy /> {copyButtonText}
        </button>
      </div>
      <span className="fw-500 password-strength" id="passwordStrengthItem">
        {passwordStrength}
      </span>
      <div className="slider">
        <div>
          <label id="slider-label">Password Length: </label>
          <span>{passwordLength}</span>
        </div>
        <Slider
          max={30}
          min={5}
          value={passwordLength}
          onChange={onChangePasswordLength}
          className="slider-style"
        />
      </div>
      <div className="elements">
        <Checkbox
          className="checkbox"
          id="uppercase"
          label="Uppercase"
          checked={includeUppercase}
          onChange={() => setIncludeUppercase(!includeUppercase)}
        />
        <Checkbox
          className="checkbox"
          id="lowercase"
          label="Lowercase"
          checked={includeLowercase}
          onChange={() => setIncludeLowercase(!includeLowercase)}
        />
        <Checkbox
          className="checkbox"
          id="numbers"
          label="Numbers"
          checked={includeNumber}
          onChange={() => setIncludeNumber(!includeNumber)}
        />
        <Checkbox
          className="checkbox"
          id="specialChars"
          label="Special Characters"
          checked={includeSpecialChars}
          onChange={() => setIncludeSpecialChars(!includeSpecialChars)}
        />
      </div>
    </div>
  )
}

export default PasswordGenerator
