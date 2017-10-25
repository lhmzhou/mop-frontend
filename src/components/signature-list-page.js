import React from 'react'
import PropTypes from 'prop-types'

import SignatureListItem from './signature-list-item.js'

const SignatureListPage = ({ signatures, startNumber }) => (
  <div className='signature-table'>
    <ul className='unstyled'>
    {signatures.map((signature, index) => (
      <SignatureListItem
        key={startNumber + index}
        number={startNumber + index}
        signature={signature}
      />
    ))}
    </ul>
  </div>
)

SignatureListPage.propTypes = {
  signatures: PropTypes.arrayOf(PropTypes.object),
  startNumber: PropTypes.number
}

export default SignatureListPage
