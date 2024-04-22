export class Designer {
  setProps(nextProps) {
    const props = this.props ? { ...this.props, ...nextProps } : nextProps
    this.props = props
  }
}