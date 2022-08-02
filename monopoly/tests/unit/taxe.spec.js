///import { expect } from 'chai'
///import { shallowMount } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import Taxe from '@/components/Taxe.vue'
var expect = require('chai').expect
///var taxe = require('@/components/Taxe.vue')

describe('ImgTaxe', function(){

  /*it('should display an img', function(){
     expect(Taxe).to.have.property('nom')

  })*/
  const wrapper = mount(Taxe, {
    propsData: {
      nom: 'TAXE DE LUXE'
    }
  })
  expect(wrapper.props().nom).to.eventually.equal('TAXE DE LUXE');
  ///expect(wrapper.props('TAXE DE LUXE')).toBe('TAXE DE LUXE')
})





