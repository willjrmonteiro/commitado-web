
export default function FormatMoney(num) {
  
        return '$ ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
