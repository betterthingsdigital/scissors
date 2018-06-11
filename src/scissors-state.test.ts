import { ScissorsState } from './scissors-state'

describe('ScissorsState', () => {
  describe('creation', () => {
    it('does apply default values if no initial props are specified', () => {
      let state = new ScissorsState()
      expect(state.toJS()).toEqual({
        aspect: 0,
        crop: null,
        focus: null,
        image: null,
        imageUrl: '',
      })
    })
  })
  test('relative crop', () => {
    // user
    let state = new ScissorsState({
      imageUrl: '/img.jpeg',
      crop: {
        x: 10,
        y: 20,
        width: 30,
        height: 40,
      },
      aspect: 0,
    })

    // onImageLoaded
    state = state.setImage({ width: 600, height: 400 })

    expect(state.toJS()).toEqual({
      imageUrl: '/img.jpeg',
      image: { width: 600, height: 400 },
      crop: {
        x: 10,
        y: 20,
        width: 30,
        height: 40,
      },
      focus: null,
      aspect: 0,
    })

    // onCropChange
    state = state.updateRelativeCrop({
      x: 0,
      y: 0,
      width: 50,
      height: 100,
    })

    expect(state.toJS()).toEqual({
      imageUrl: '/img.jpeg',
      image: { width: 600, height: 400 },
      crop: {
        x: 0,
        y: 0,
        width: 300,
        height: 400,
      },
      focus: null,
      aspect: 0,
    })

    expect(state.getRelativeCrop()).toEqual({
      x: 0,
      y: 0,
      width: 50,
      height: 100,
      aspect: 0,
    })
  })

  test('setImage when initial crop is not set', () => {
    let state = new ScissorsState()
    state = state.setImage({ width: 600, height: 400 })
    expect(state.toJS()).toEqual({
      image: { width: 600, height: 400 },
      imageUrl: '',
      crop: {
        x: 0,
        y: 0,
        height: 400,
        width: 600,
      },
      focus: null,
      aspect: 0,
    })
  })

  test('focus point', () => {
    // user
    let state = new ScissorsState({
      imageUrl: '/img.jpeg',
      crop: {
        x: 10,
        y: 20,
        width: 30,
        height: 40,
      },
      focus: { x: 20, y: 30 },
      aspect: 0,
    })

    // onImageLoaded
    state = state.setImage({ width: 600, height: 400 })

    expect(state.toJS()).toEqual({
      imageUrl: '/img.jpeg',
      image: { width: 600, height: 400 },
      crop: {
        x: 10,
        y: 20,
        width: 30,
        height: 40,
      },
      focus: { x: 20, y: 30 },
      aspect: 0,
    })

    state = state.setFocus(null)

    expect(state.toJS()).toEqual({
      imageUrl: '/img.jpeg',
      image: { width: 600, height: 400 },
      crop: {
        x: 10,
        y: 20,
        width: 30,
        height: 40,
      },
      focus: null,
      aspect: 0,
    })

    state = state.setFocus({ x: 25, y: 35 })

    expect(state.toJS()).toEqual({
      imageUrl: '/img.jpeg',
      image: { width: 600, height: 400 },
      crop: {
        x: 10,
        y: 20,
        width: 30,
        height: 40,
      },
      focus: { x: 25, y: 35 },
      aspect: 0,
    })
  })

  test('crop center', () => {
    // user
    let state = new ScissorsState({
      imageUrl: '/img.jpeg',
      crop: null,
      focus: { x: 20, y: 30 },
    })

    expect(state.getCropCenter()).toBeNull()

    // onImageLoaded
    state = state.setImage({ width: 600, height: 400 })

    expect(state.getCropCenter()).toEqual({
      x: 300,
      y: 200,
    })
  })

  test('aspect ratio', () => {
    // user
    let state = new ScissorsState({
      imageUrl: '/img.jpeg',
      crop: {
        x: 10,
        y: 20,
        width: 135,
        height: 90,
      },
      aspect: 3 / 2,
    })

    // onImageLoaded
    state = state.setImage({ width: 600, height: 400 })

    expect(state.toJS()).toEqual({
      imageUrl: '/img.jpeg',
      image: { width: 600, height: 400 },
      crop: {
        x: 10,
        y: 20,
        width: 135,
        height: 90,
      },
      focus: null,
      aspect: 3 / 2,
    })

    expect(state.aspect).toBe(3 / 2)

    state = state.setAspect(1)

    expect(state.toJS()).toEqual({
      imageUrl: '/img.jpeg',
      image: { width: 600, height: 400 },
      crop: {
        x: 0,
        y: 0,
        width: 400,
        height: 400,
      },
      focus: null,
      aspect: 1,
    })
  })

  it('automatically sets crop when image is loaded and crop is not provided', () => {
    // user
    let state = new ScissorsState({
      imageUrl: '/img.jpeg',
      crop: null,
      aspect: 2 / 1,
    })

    // onImageLoaded
    state = state.setImage({ width: 600, height: 400 })

    expect(state.toJS()).toEqual({
      imageUrl: '/img.jpeg',
      image: { width: 600, height: 400 },
      crop: {
        x: 0,
        y: 0,
        width: 600,
        height: 300,
      },
      focus: null,
      aspect: 2 / 1,
    })
  })

  it('focus point can not be moved outside crop', () => {
    // user
    let state = new ScissorsState({
      imageUrl: '/img.jpeg',
      crop: {
        x: 10,
        y: 20,
        width: 30,
        height: 40,
      },
      focus: { x: 20, y: 30 },
      aspect: 0,
    })

    // onImageLoaded
    state = state.setImage({ width: 600, height: 400 })

    // move focus point
    expect(() => {
      state.setFocus({ x: 50, y: 70 })
    }).toThrow()
  })

  it('crop can not be moved away from focus point', () => {
    // user
    let state = new ScissorsState({
      imageUrl: '/img.jpeg',
      crop: {
        x: 10,
        y: 20,
        width: 30,
        height: 40,
      },
      focus: { x: 20, y: 30 },
      aspect: 0,
    })

    // onImageLoaded
    state = state.setImage({ width: 600, height: 400 })

    // move / resize crop
    expect(() => {
      state.updateRelativeCrop({
        x: 0,
        y: 0,
        width: 5,
        height: 5,
        aspect: 0,
      })
    }).toThrow()
  })
})
